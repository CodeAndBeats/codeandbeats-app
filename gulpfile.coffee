path = require "path"
http = require "http"
gulp = require "gulp"
jade = require "gulp-jade"
stylus = require "gulp-stylus"
coffee = require "gulp-coffee"
reload = require "gulp-livereload"
express = require "express"

app = express()
app.use express.static path.resolve __dirname, "./www"
port = 5000

gulp.task "server", ->
  server = http.Server app
  server.listen port
  console.log "Server starting on port #{port}"


gulp.task "stylus", ->
  gulp.src "./src/css/main.styl"
  .pipe stylus()
  .pipe gulp.dest "./www/css"
  .pipe reload()

gulp.task "jade", ->
  gulp.src "./src/**/*.jade"
  .pipe jade()
  .pipe gulp.dest "./www/"
  .pipe reload()

gulp.task "coffee", ->
  gulp.src "./src/**/*.coffee"
  .pipe coffee()
  .pipe gulp.dest "./www/"
  .pipe reload()



gulp.task "copy", ->
  gulp.src ["./src/**/*", "!./src/**/*.coffee", "!./src/**/*.jade", "!./src/**/*.styl"]
  .pipe gulp.dest "./www/"
  .pipe reload()

gulp.task "watch", ->
  gulp.watch ["./src/**/*.coffee"], ["coffee"]
  gulp.watch ["./src/**/*.jade"], ["jade"]
  gulp.watch ["./src/**/*.styl"], ["stylus"]
  gulp.watch ["!./src/**/*.coffee", "!./src/**/*.jade", "!./src/**/*.styl"], ["copy"]


gulp.task "default", ["stylus", "jade", "coffee", "copy", "watch", "server"]
