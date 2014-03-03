express           = require 'express'
io                = require 'socket.io'
http              = require 'http'
path              = require 'path'
fs                = require 'fs'
child_process     = require 'child_process'
log               = require './log'
version           = require './version'
render            = require './render'
wrench            = require 'wrench'

module.exports =

  create: ()->
     # clear terminal
    log.clear()

    instance = new @Server()
    instance

  Server: class Server

    constructor:()->
      log.notice "Threeflow " + version.number

      @opts     = null
      @app      = null
      @server   = null
      @io       = null

      # connected clients
      @clients  = {} # hash of client it to client object.
      @renderQ  = render.createQueue @

    javaDetect:(onComplete)->
      log.info "Detecting Java"
      child_process.exec "java -version",(error,stdout,stderr)=>
        if error
          log.error "Java not found. Install it!"
          onComplete(false)
        else
          onComplete(true)

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
          memory: "-Xmx2G"
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
          renders: "/deploy/renders"
          #textures: "/deploy/textures"
          #models: "/deploy/models"
          #hdr: "/hdr"
          #bakes: "/bakes"

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
      # no config file / no run..  ( cannot write .sc files to node_modules folder )
      # need to look into this.
      success = false
      try
        log.info "Looking for config"
        jsonPath = path.join(cwd,"threeflow.json")
        jsonFile = fs.readFileSync(jsonPath)
        jsonOpts = JSON.parse jsonFile
        @options jsonOpts

        @opts.flags.allowSave = true
        @setCwd cwd
        log.info "Found /threeflow.json"
        success = true
      catch error
        @setCwd null
        @options()
        if error instanceof SyntaxError
          log.warn "Error parsing /threeflow.json. [ '" + error.message + "' ]"
        else
          log.warn "No /threeflow.json found."
          log.info "Type 'threeflow init' to start a project."
          log.info()
        success = false

      success

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
        log.notice "Starting up without config for now (Renders won't be saved!)"
        # use node modules folder
        # shouldn't need to set allowSave = false, as this should be the default
        @cwd = path.join(__dirname,"..")
      else
        log.notice "Starting up..."

      # check all renders/textures folders.
      for folder of @opts.folders
        absFolder = path.join @cwd,@opts.folders[folder]
        @opts.folders[folder] =  absFolder
        # validate and create.
        if not fs.existsSync absFolder
          wrench.mkdirSyncRecursive absFolder

      @app      = express()
      @server   = http.createServer @app
      @io       = io.listen @server,
        log: @opts.server.debug

      @io.sockets.on 'connection', @onConnection

      @server.listen @opts.server.port
      log.info "Listening on localhost:" + @opts.server.port

      staticFolder = path.join(@cwd,@opts.server.static)
      if not fs.existsSync staticFolder
        wrench.mkdirSyncRecursive staticFolder

      @app.use '/', express.static( staticFolder )

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