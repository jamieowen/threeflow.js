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

    instance = new @Server()
    instance

  Server: class Server

    constructor:()->
      log.notice "[ THREEFLOW " + version.number + " ]"

      @opts     = null
      @app      = null
      @server   = null
      @io       = null

      # connected clients
      @clients  = {} # hash of client it to client object.
      @renderQ  = render.createQueue @

    javaDetect:()->
      return true

    defaults:()->
      opts =
        server:
          port: 3710
          debug: false
          static: "/examples"

        sunflow:
          version: "-version"
          command: "java"
          jar: path.join( __dirname, "../sunflow/sunflow.jar")
          memory: "-Xmx1G"
          args: [
            "-server"
          ]

        flags:
          multipleRenders: false
          allowSave: false
          allowQueue: false
          deleteSc: true
          cancelRendersOnDisconnect: false

        folders:
          renders: "/examples/renders"
          textures: "/examples/textures"
          models: "/examples/models"
          hdr: "/hdr"
          bakes: "/bakes"

      opts

    options:( options={} )->
      @opts = @defaults()

      for opt of options.server
        @opts.server[opt] = options.server[opt]

      for opt of options.flags
        @opts.flags[opt] = options.flags[opt]

      for opt of options.folders
        @opts.folders[opt] = options.folders[opt]

      null

    optionsJSON:(cwd)->
      try
        log.info "Looking for config..."
        jsonPath = path.join(cwd,"threeflow.json")
        jsonFile = fs.readFileSync(jsonPath)
        jsonOpts = JSON.parse jsonFile
        @options jsonOpts
        @setCwd cwd
        log.info "Found config :" + jsonPath
      catch error
        @setCwd null
        @options()
        if error instanceof SyntaxError
          log.warn "Config found but error parsing it. [ '" + error.message + "' ]"
        else
          log.warn "No config found.  Use 'threeflow init' to start a project."

      null

    forceSave:(value)->
      if value
        @opts.flags.allowSave = true

      null

    setCwd:(cwd)->
      @cwd = cwd

    startup:()->
      if not @opts
        @opts = @defaults()

      if not @cwd
        log.notice "Starting up without config for now... (Renders won't be saved!)"
        # use node modules folder
        # shouldn't need to set allowSave = false, as this should be the default
        @cwd = path.join(__dirname,"..")
      else
        log.notice "Starting up with config..."

      # TODO: should validate / create folder paths
      # convert to absolute paths

      console.log @opts.folders
      for folder of @opts.folders
        console.log folder,@cwd,@opts.folders[folder]
        absFolder = path.join @cwd,@opts.folders[folder]
        @opts.folders[folder] =  absFolder

      @app      = express()
      @server   = http.createServer @app
      @io       = io.listen @server,
        log: @opts.server.debug

      @io.sockets.on 'connection', @onConnection

      @server.listen @opts.server.port
      log.info "Listening on localhost:" + @opts.server.port

      @app.use '/', express.static( path.join(@cwd,@opts.server.static) )

      log.info "Serving " + @opts.server.static
      log.notice "Waiting for connection... "

    # when we receive a connection
    onConnection:(socket)=>
      client = new Client(socket,@)
      @clients[ client.id ] = client

      log.info "Client Connected : " + client.id

    # removes a client and cleans up.
    disconnectClient:(client)->
      log.info "Client Disconnected : " + client.id

      @clients[ client.id ] = null
      delete @clients[ client.id ]

      @renderQ.removeAllByClient client
      client.dispose()

  ###
  Client Object.
  ###

  Client: class Client
    constructor:(@socket,@server)->
      @id = @socket.id
      @socket.emit 'connected',
        id: @socket.id

      @socket.on 'render',@onRender
      @socket.on 'disconnect',@onDisconnect

      @connected = true
      @renderID = 0


    generateRenderID:()->
      @renderID++
      @id + "-" + @renderID

    onRender:(renderData)=>
      log.notice "Received Render..."

      source      = renderData.source
      options     = renderData.options
      sunflowCl   = renderData.sunflowCl

      # TODO: need to validate input here .

      ren = render.createRender @,source,options,sunflowCl
      @server.renderQ.add ren

      @socket.emit 'render-added',
        id: ren.id
        status: ren.status
        message: ren.message

      @server.renderQ.process()

      null

    onDisconnect:()=>
      # remove self.
      @connected = false
      @server.disconnectClient @

    dispose:()->
      @socket = null
      null