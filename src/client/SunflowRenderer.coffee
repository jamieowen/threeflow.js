
window.THREEFLOW = window.THREEFLOW || {}

THREEFLOW.SunflowRenderer = class SunflowRenderer

  # connection status
  @CONNECTING       = "connecting"
  @CONNECTED        = "connected"
  @ERROR            = "error"

  # render status / socket event
  @RENDER_ADDED     = "render-added"
  @RENDER_START     = "render-start"
  @RENDER_PROGRESS  = "render-progress"
  @RENDER_COMPLETE  = "render-complete"
  @RENDER_ERROR     = "render-error"

  # pass either a render name, or an options object.
  constructor:(options={})->

    if typeof options is "string"
      @name       = options
      @scale      = 1
      @overwrite  = false
      @savesc     = false
    else
      @name       = options.name || null
      @scale      = options.scale || 1
      @overwrite  = options.overwrite || false
      @savesc     = options.savesc || false


    # sunflow command line options
    @sunflow_cl =
      nogui: false    # do not show sunflow gui
      ipr: false      # progressive rendering
      hipri: false    # high thread priority
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

    @socket.on SunflowRenderer.RENDER_ADDED,@onRenderAdded
    @socket.on SunflowRenderer.RENDER_START,@onRenderStart
    @socket.on SunflowRenderer.RENDER_PROGRESS,@onRenderProgress
    @socket.on SunflowRenderer.RENDER_COMPLETE,@onRenderComplete
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
          savesc: @savesc
        sunflow_cl: @sunflow_cl

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
    @setConnectionStatus SunflowRenderer.CONNECTED
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
      progress: data.data

    null

  onRenderComplete:(data)=>
    @rendering = false
    @onRenderStatus.dispatch
      status: SunflowRenderer.RENDER_COMPLETE
      duration: data

    null

  onRenderError:(data)=>
    @rendering = false
    @onRenderStatus.dispatch
      status: SunflowRenderer.RENDER_ERROR
      message: data

    null


