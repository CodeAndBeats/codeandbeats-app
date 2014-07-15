(function() {
  $(document).ready(function(jQuery) {
    var RGBtoHex, app, calculateIncrement, colorCycle, colorDistance, fps, generateRGB, getElementBG, iteration, onError, onSuccess, showLogin, socket, userHandle;
    socket = io.connect("http://codeandbeats-20720.onmodulus.net");
    userHandle = false;
    onSuccess = function(accel) {
      var x, y;
      x = (accel.x * -5) + 50;
      y = (accel.y * 5) + 50;
      $(".circle").css({
        left: "" + x + "%",
        top: "" + y + "%"
      });
      accel.user = userHandle;
      socket.emit("accel", {
        data: accel
      });
    };
    onError = function(e) {
      return alert("onError! " + e);
    };
    showLogin = function() {
      var name;
      name = prompt("name");
      if (name !== null) {
        userHandle = name;
        return app.onDeviceReady();
      }
    };
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
    app = {
      initialize: function() {
        this.bindEvents();
      },
      bindEvents: function() {
        return document.addEventListener("deviceready", this.onDeviceReady, false);
      },
      onDeviceReady: function() {
        if (userHandle === false) {
          return showLogin();
        }
        colorCycle();
        return navigator.accelerometer.watchAcceleration(onSuccess, onError, {
          frequency: 50
        });
      }
    };
    document.body.addEventListener("load", app.initialize(), false);
    socket.on("connect", function() {
      var socketError;
      socketError = false;
      $(".message, .error").hide().text("");
      return $(".message").show().text("Connected! :)").fadeOut();
    });
    return socket.on("disconnect", function() {
      var socketError;
      socketError = true;
      return $(".error").show().text("Error: Disconnected from Socket");
    });
  });

}).call(this);
