express           = require 'express'
io                = require 'socket.io'
http              = require 'http'
path              = require 'path'
fs                = require 'fs'

module.exports =

  create: ()->
    instance = new @ThreeflowServer()
    instance

  ThreeflowServer: class ThreeflowServer

    constructor:()->
      console.log "new server instance"
      @options()


    ###
    saving : allow saving of pngs & .sc files.
    output : output save path of pngs and .sc files.
    multiple : allow multiple render jobs to be spawned at once.
    queue: queue jobs and spawn automatically, if multiple is true
    ###
    options:( options={} )->
      @saving     = options.saving || false
      @output     = options.output || null
      @multiple   = options.output || false
      @queue      = options.queue || false

      # server options.
      # port: the listening port
      # static: an alternative static serving folder ( instead of examples )
      @port       = options.port || 3710
      @deploy     = options.deploy || null

      null

    startup:()->
      console.log "startup"

      # validate options.


      # if all is good.
      @app      = express()
      @server   = http.createServer @app
      @io       = io.listen @server

      @server.listen @port

      @app.use '/', express.static( path.join( __dirname,'../','examples') )





