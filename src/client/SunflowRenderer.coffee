
window.THREEFLOW = window.THREEFLOW || {}

THREEFLOW.SunflowRenderer = class SunflowRenderer

  # connection status
  @CONNECTING       = "connecting"
  @CONNECTED        = "connected"
  @ERROR            = "error"

  # render status
  @RENDER_START     = "render-start"
  @RENDER_PROGRESS  = "render-progress"
  @RENDER_COMPLETE  = "render-complete"
  @RENDER_ERROR     = "render-error"

  constructor:(options)->
    options = options || {}

    @pngPath  = options.pngPath || null
    @scPath   = options.scPath || null
    @scSave   = options.scSave || false
    @scale    = options.scale || 1

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
    @socket.on 'render-start',@onRenderStart
    @socket.on 'render-progress',@onRenderProgress
    @socket.on 'render-complete',@onRenderComplete
    @socket.on 'render-error',@onRenderError

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
      scContents = @exporter.exportCode()

      @socket.emit "render",
         scContents:scContents
         scPath:@scPath
         scSave:@scSave
         pngPath:@pngPath

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

  onRenderStart:(data)=>
    # TODO : Need better status - in sync with server / queued / parsing / etc...
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


