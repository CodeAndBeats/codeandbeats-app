(function() {
  $(document).ready(function(jQuery) {
    var RGBtoHex, animate, app, calculateIncrement, checkStatus, colorCycle, colorDistance, fps, generateRGB, getElementBG, iteration, onError, onSuccess, showLogin, socket, socketError, stopAnimate;
    socket = io.connect("http://lacy.ngrok.com");
    $(".message, .error").hide().text("");
    socketError = true;
    onSuccess = function(accel) {

      /*
      document.getElementById("x").innerHTML = accel.x
      document.getElementById("y").innerHTML = accel.y
      document.getElementById("z").innerHTML = accel.z
       */
      socket.emit("accel", {
        data: accel
      });
    };
    onError = function() {
      return alert("onError!");
    };
    animate = function() {

      /*
      block = $(".graph")
      block.animate
        "backgroundColor": "#333"
         *backgroundColor: jQuery.Color(block.css("backgroundColor")).hue("+=50")
      , 3000, animate
      return
       */
    };
    stopAnimate = function() {
      var block;
      console.log("stoping animation");
      block = $(".graph");
      return block.animate().stop().animate({
        backgroundColor: "#e74c3c"
      });
    };
    checkStatus = function() {
      if (socketError) {
        stopAnimate();
        return $(".error").show().text("Error: Disconnected from Socket");
      } else {
        animate();
        $(".message, .error").hide().text("");
        return $(".message").show().text("Connected! :)").fadeOut();
      }
    };
    showLogin = function() {
      OAuth.initialize("V8o2C_OyHInrOKWlj9dOlnSPUss");
      return OAuth.popup("twitter", {
        cache: true
      }).done(function(result) {
        return alert(JSON.stringify(result));
      }).fail(function(err) {
        return alert(JSON.stringify(err));
      });
    };
    app = {
      initialize: function() {
        this.bindEvents();
      },
      bindEvents: function() {
        return document.addEventListener("deviceready", this.onDeviceReady, false);
      },
      onDeviceReady: function() {
        navigator.accelerometer.watchAcceleration(onSuccess, onError, {
          frequency: 50
        });
        return showLogin();
      }
    };
    document.body.addEventListener("load", app.initialize(), false);
    socket.on("connect", function() {
      socketError = false;
      return checkStatus();
    });
    socket.on("disconnect", function() {
      socketError = true;
      return checkStatus();
    });
    getElementBG = function(elm) {
      var color, colorString, elementColor, endIndex, i, startIndex;
      elementColor = window.getComputedStyle(elm).backgroundColor;
      startIndex = elementColor.indexOf("(") + 1;
      endIndex = elementColor.indexOf(")");
      colorString = elementColor.substring(startIndex, endIndex);
      color = colorString.split(",");
      i = 0;
      while (i < 3) {
        color[i] = parseInt(color[i].trim());
        i++;
      }
      return color;
    };
    generateRGB = function() {
      var color, i;
      color = [];
      i = 0;
      while (i < 3) {
        color.push(Math.floor(Math.random() * 250));
        i++;
      }
      return color;
    };
    RGBtoHex = function(color) {
      var hex, i;
      hex = [];
      i = 0;
      while (i < 3) {
        hex.push(color[i].toString(16));
        if (hex[i].length < 2) {
          hex[i] = "0" + hex[i];
        }
        i++;
      }
      return "#" + hex[0] + hex[1] + hex[2];
    };
    colorDistance = function(cur, next) {
      var distance, i;
      distance = [];
      i = 0;
      while (i < 3) {
        distance.push(Math.abs(cur[i] - next[i]));
        i++;
      }
      return distance;
    };
    calculateIncrement = function(distance) {
      var i, increment;
      increment = [];
      i = 0;
      while (i < 3) {
        increment.push(Math.abs(Math.floor(distance[i] / iteration)));
        if (increment[i] === 0) {
          increment[i]++;
        }
        i++;
      }
      return increment;
    };
    fps = 25;
    iteration = Math.round(1000 / fps);
    colorCycle = function() {
      var currentColor, elm, handler, increment, randomColor, transition;
      transition = function() {
        if (currentColor[0] > randomColor[0]) {
          currentColor[0] -= increment[0];
          if (currentColor[0] <= randomColor[0]) {
            increment[0] = 0;
          }
        } else {
          currentColor[0] += increment[0];
          if (currentColor[0] >= randomColor[0]) {
            increment[0] = 0;
          }
        }
        if (currentColor[1] > randomColor[1]) {
          currentColor[1] -= increment[1];
          if (currentColor[1] <= randomColor[1]) {
            increment[1] = 0;
          }
        } else {
          currentColor[1] += increment[1];
          if (currentColor[1] >= randomColor[1]) {
            increment[1] = 0;
          }
        }
        if (currentColor[2] > randomColor[2]) {
          currentColor[2] -= increment[2];
          if (currentColor[2] <= randomColor[2]) {
            increment[2] = 0;
          }
        } else {
          currentColor[2] += increment[2];
          if (currentColor[2] >= randomColor[2]) {
            increment[2] = 0;
          }
        }
        elm.style.background = RGBtoHex(currentColor);
        if (increment[0] === 0 && increment[1] === 0 && increment[2] === 0) {
          clearInterval(handler);
          colorCycle();
        }
      };
      elm = document.getElementById("graph");
      currentColor = getElementBG(elm);
      randomColor = generateRGB();
      increment = calculateIncrement(colorDistance(currentColor, randomColor));
      handler = setInterval(transition, iteration);
    };
    return colorCycle();
  });

}).call(this);
