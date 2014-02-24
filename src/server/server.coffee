express           = require 'express'
io                = require 'socket.io'
http              = require 'http'
path              = require 'path'
fs                = require 'fs'
log               = require './log'
version           = require './version'
render            = require './render'

module.exports =

  create: ()->
     # clear terminal
    log.clear()

    instance = new @ThreeflowServer()
    instance

  ThreeflowServer: class ThreeflowServer

    constructor:()->
      log.notice "[ THREEFLOW " + version.number + " ]"

      @opts     = null
      @app      = null
      @server   = null
      @io       = null

    javaDetect:()->
      return true

    defaults:()->
      opts =
        server:
          port: 3710
          debug: false

        sunflow:
          version: "-version"
          command: "java"
          jar: path.join( __dirname, "../sunflow/sunflow.jar")
          args: [
            "-Xmx1G"
            "-server"
          ]

        flags:
          multipleRenders: false
          allowSave: false
          allowQueue: false

        folders:
          serve: "/examples"
          renders: "/examples/renders"
          textures: "/examples/textures"
          models: "/examples/models"
          hdr: "/hdr"
          bakes: "/bakes"

      opts

    options:( options={} )->
      @opts = defaults()

      for opt of options.server
        @opts.server[opt] = options[opt]

      for opt of options.flags
        @opts.flags[opt] = options[opt]

      for opt of options.folders
        @opts.folders[opt] = options[opt]

      null

    optionsJSON:(cwd)->
      try
        log.info "Looking for config..."
        jsonPath = path.join(path,"threeflow.json")
        jsonOpts = JSON.parse fs.readFileSync(jsonPath)
        @options jsonOpts
        @setCwd cwd
        log.info "Using " + jsonPath
      catch error
        @setCwd null
        log.warn "No config found.  Use 'threeflow init' to start a project."

      null

    setCwd:(cwd)->
      @cwd = cwd

    startup:()->
      if not @opts
        @opts = @defaults()

      if not @cwd
        log.notice "Starting up without config. [Renders won't be saved]"
        # use node modules folder
        @cwd = path.join(__dirname, "..")
      else
        log.notice "Starting up with config."


      # if all is good.
      @app      = express()
      @server   = http.createServer @app
      @io       = io.listen @server,
        log: @opts.server.debug

      @io.sockets.on 'connection', @onConnection
      @io.sockets.on 'disconnect', @onDisconnect


      @server.listen @opts.server.port
      log.info "Listening on localhost:" + @opts.server.port

      @app.use '/', express.static( path.join(@cwd,@opts.folders.serve) )
      log.info "Serving " + @opts.folders.serve
      log.info "Waiting for connection... "

    # when we receive a connection
    onConnection:(socket)=>
      log.info "Connection with :" + socket.id

      socket.emit 'connected',
        event:'connected'
        data: {}

      socket.on 'render',@onRender
      socket.on 'disconnect',()->
        console.log "DISCONNECTED ", socket.id

    onDisconnect:(socket)->


    onRender:(data)=>
      console.log "RENDER"
      console.log data








