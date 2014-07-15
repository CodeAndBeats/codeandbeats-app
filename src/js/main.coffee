$(document).ready ->
  socket = io.connect "http://codeandbeats-20720.onmodulus.net"

  userHandle = false

  onSuccess = (accel) ->
    x = (accel.x * -5)+ 50
    y = (accel.y * 5)+ 50
    $(".circle").css
      left: "#{x}%"
      top: "#{y}%"
    accel.user = userHandle
    socket.emit "accel",
      data: accel
    return

  onError = (e) ->
    return alert "onError! #{e}"


  showLogin = ->
    name = prompt "name"
    if name != null
      userHandle = name
      app.onDeviceReady()

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

  app =
    initialize: ->
      @bindEvents()
      return

    bindEvents: ->
      return document.addEventListener "deviceready", @onDeviceReady, false

    onDeviceReady: ->
      return showLogin() if userHandle is false
      colorCycle()
      navigator.accelerometer.watchAcceleration onSuccess, onError,
        frequency: 50


  document.body.addEventListener "load", app.initialize(), false


  socket.on "connect", ->
    socketError = false
    $(".message, .error").hide().text ""
    $(".message").show().text("Connected! :)").fadeOut()

  socket.on "disconnect", ->
    socketError = true
    $(".error").show().text "Error: Disconnected from Socket"


