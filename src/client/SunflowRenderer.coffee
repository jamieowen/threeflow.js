
window.THREEFLOW = window.THREEFLOW || {}

THREEFLOW.SunflowRenderer = class SunflowRenderer

  # connection status
  @CONNECTING       = "connecting"
  @CONNECTED        = "connected"
  @DISCONNECTED     = "disconnected"
  @ERROR            = "error"

  # render status / socket event
  @RENDER_ADDED     = "render-added"
  @RENDER_START     = "render-start"
  @RENDER_PROGRESS  = "render-progress"
  @RENDER_CANCELLED = "render-cancelled"
  @RENDER_COMPLETE  = "render-complete"
  @RENDER_ERROR     = "render-error"

  # pass either a render name, or an options object.
  constructor:(options={})->

    if typeof options is "string"
      @name       = options
      @scale      = 1
      @overwrite  = false
      @deleteSc   = true
    else
      @name       = options.name || null
      @scale      = options.scale || 1
      @overwrite  = options.overwrite || false

      if options.deleteSc is undefined or options.deleteSc is null or ( typeof options.deleteSc isnt "boolean" )
        @deleteSc = true
      else
        @delteSc = false

    # sunflow command line options
    @sunflowCl =
      noGui: false     # do not show sunflow gui
      ipr: true       # progressive rendering
      hiPri: false     # high thread priority
      # ...loads more, but will add later.

    @exporter = new Exporter()

    # map block exporters for shorthand access
    @image              = @exporter.image
    @bucket             = @exporter.bucket
    @traceDepths        = @exporter.traceDepths
    @caustics           = @exporter.caustics
    @gi                 = @exporter.gi

    @cameras            = @exporter.cameras
    @lights             = @exporter.lights
    @materials          = @exporter.materials
    @geometry           = @exporter.geometry
    @bufferGeometry     = @exporter.bufferGeometry
    @meshes             = @exporter.meshes

    @connectionStatus   = ""
    @connected          = false
    @rendering          = false

    # signals
    @onRenderStatus     = new THREEFLOW.Signal()
    @onConnectionStatus = new THREEFLOW.Signal()

  connect:()->
    if @connected
      return

    @setConnectionStatus SunflowRenderer.CONNECTING

    @socket = io.connect @host

    @socket.on 'connected',@onConnected
    @socket.on 'disconnected',@onDisconnected

    @socket.on SunflowRenderer.RENDER_ADDED,@onRenderAdded
    @socket.on SunflowRenderer.RENDER_START,@onRenderStart
    @socket.on SunflowRenderer.RENDER_PROGRESS,@onRenderProgress
    @socket.on SunflowRenderer.RENDER_COMPLETE,@onRenderComplete
    @socket.on SunflowRenderer.RENDER_CANCELLED,@onRenderCancelled
    @socket.on SunflowRenderer.RENDER_ERROR,@onRenderError

    null

  render:(scene,camera,width,height)->
    if not @connected
      throw new Error "[SunflowRenderer] Call connect() before rendering."
    else if not @rendering

      @onRenderStatus.dispatch
        status: SunflowRenderer.RENDER_START

      @rendering = true

      @exporter.image.resolutionX = width*@scale
      @exporter.image.resolutionY = height*@scale

      @exporter.indexScene scene
      source = @exporter.exportCode()

      @socket.emit "render",
        source: source
        options:
          name: @name
          scale: @scale
          overwrite: @overwrite
          deleteSc: @deleteSc
        sunflowCl: @sunflowCl

    else
      console.log "[Render in Progress]"

    null

  setConnectionStatus:(status)->
    if @connectionStatus is status
      return

    @connectionStatus = status
    @onConnectionStatus.dispatch
      status: status

    null

  onConnected:(data)=>
    console.log "THREEFLOW " + THREEFLOW.VERSION + " [Connected]"
    @connected = true
    @rendering = false
    @setConnectionStatus SunflowRenderer.CONNECTED
    null

  onDisconnected:(data)=>
    console.log "THREEFLOW " + THREEFLOW.VERSION + " [Disconnected]"
    @connected = false
    @rendering = false # reset as we assume we are not anymore..

    @setConnectionStatus SunflowRenderer.DISCONNECTED
    null

  onRenderAdded:(data)=>
    console.log "ADDED",data
    @onRenderStatus.dispatch
      status: SunflowRenderer.RENDER_ADDED

    null

  onRenderStart:(data)=>
    @onRenderStatus.dispatch
      status: SunflowRenderer.RENDER_START

    null

  onRenderProgress:(data)=>

    @onRenderStatus.dispatch
      status: SunflowRenderer.RENDER_PROGRESS
      progress: data.progress

    null

  onRenderComplete:(data)=>
    @rendering = false
    @onRenderStatus.dispatch
      status: SunflowRenderer.RENDER_COMPLETE
      duration: data

    null

  onRenderCancelled:(data)=>
    @rendering = false
    @onRenderStatus.dispatch
      status: SunflowRenderer.RENDER_CANCELLED

    null



  onRenderError:(data)=>
    @rendering = false
    @onRenderStatus.dispatch
      status: SunflowRenderer.RENDER_ERROR
      message: data

    null


