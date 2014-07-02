$(document).ready (jQuery) ->
  socket = io.connect "http://lacy.ngrok.com"
  $(".message, .error").hide().text ""

  socketError = true

  onSuccess = (accel) ->
    ###
    document.getElementById("x").innerHTML = accel.x
    document.getElementById("y").innerHTML = accel.y
    document.getElementById("z").innerHTML = accel.z
    ###
    socket.emit "accel",
      data: accel
    return

  onError = ->
    return alert "onError!"

  animate = ->
    ###
    block = $(".graph")
    block.animate
      "backgroundColor": "#333"
      #backgroundColor: jQuery.Color(block.css("backgroundColor")).hue("+=50")
    , 3000, animate
    return
    ###
  stopAnimate = ->
    console.log "stoping animation"
    block = $(".graph")
    block.animate().stop().animate
      backgroundColor: "#e74c3c"

  checkStatus = ->
    if socketError
      stopAnimate()
      $(".error").show().text "Error: Disconnected from Socket"
    else
      animate()
      $(".message, .error").hide().text ""
      $(".message").show().text("Connected! :)").fadeOut()

  showLogin = ->
    OAuth.initialize "V8o2C_OyHInrOKWlj9dOlnSPUss"
    OAuth.popup "twitter", {cache: true}
    .done (result) ->
      alert JSON.stringify result
    .fail (err) ->
      alert JSON.stringify err


  app =
    initialize: ->
      @bindEvents()
      return

    bindEvents: ->
      return document.addEventListener "deviceready", @onDeviceReady, false
      

    onDeviceReady: ->
      navigator.accelerometer.watchAcceleration onSuccess, onError,
        frequency: 50
      showLogin()


  document.body.addEventListener "load", app.initialize(), false

  socket.on "connect", ->
    socketError = false
    checkStatus()

  socket.on "disconnect", ->
    socketError = true
    checkStatus()






  getElementBG = (elm) ->
    elementColor = window.getComputedStyle(elm).backgroundColor
    startIndex = elementColor.indexOf("(") + 1
    endIndex = elementColor.indexOf(")")
    colorString = elementColor.substring(startIndex, endIndex)
    color = colorString.split(",")
    i = 0

    while i < 3
      color[i] = parseInt(color[i].trim())
      i++
    color
  generateRGB = ->
    color = []
    i = 0

    while i < 3
      color.push Math.floor(Math.random() * 250)
      i++
    color
  RGBtoHex = (color) ->
    hex = []
    i = 0

    while i < 3
      hex.push color[i].toString(16)
      hex[i] = "0" + hex[i]  if hex[i].length < 2
      i++
    "#" + hex[0] + hex[1] + hex[2]
  colorDistance = (cur, next) ->
    distance = []
    i = 0

    while i < 3
      distance.push Math.abs(cur[i] - next[i])
      i++
    distance
  calculateIncrement = (distance) ->
    increment = []
    i = 0

    while i < 3
      increment.push Math.abs(Math.floor(distance[i] / iteration))
      increment[i]++  if increment[i] is 0
      i++
    increment
  fps = 25
  iteration = Math.round(1000 / fps)
  colorCycle = () ->
    transition = ->
      if currentColor[0] > randomColor[0]
        currentColor[0] -= increment[0]
        increment[0] = 0  if currentColor[0] <= randomColor[0]
      else
        currentColor[0] += increment[0]
        increment[0] = 0  if currentColor[0] >= randomColor[0]
      if currentColor[1] > randomColor[1]
        currentColor[1] -= increment[1]
        increment[1] = 0  if currentColor[1] <= randomColor[1]
      else
        currentColor[1] += increment[1]
        increment[1] = 0  if currentColor[1] >= randomColor[1]
      if currentColor[2] > randomColor[2]
        currentColor[2] -= increment[2]
        increment[2] = 0  if currentColor[2] <= randomColor[2]
      else
        currentColor[2] += increment[2]
        increment[2] = 0  if currentColor[2] >= randomColor[2]
      elm.style.background = RGBtoHex(currentColor)
      if increment[0] is 0 and increment[1] is 0 and increment[2] is 0
        clearInterval handler
        colorCycle()
      return
    elm = document.getElementById "graph"
    currentColor = getElementBG(elm)
    randomColor = generateRGB()
    increment = calculateIncrement(colorDistance(currentColor, randomColor))
    handler = setInterval(transition, iteration)
    return

  colorCycle()