
window.THREEFLOW = window.THREEFLOW || {}

# helper method for coffee getter/setters
if not Function::property
  Function::property = (prop, desc) ->
    Object.defineProperty @prototype, prop, desc

THREEFLOW.SunflowRenderer = class SunflowRenderer

  constructor:(options)->
    options = options || {}

    @pngPath  = options.pngPath || null
    @scPath   = options.scPath || null
    @scSave   = options.scSave || false

    @exporter = new Exporter()

    # map block exporters for shorthand access
    @image        = @exporter.image
    @traceDepths  = @exporter.traceDepths
    @caustics     = @exporter.caustics
    @gi           = @exporter.gi

    @cameras      = @exporter.cameras
    @lights       = @exporter.lights
    @materials    = @exporter.materials
    @geometry     = @exporter.geometry
    @meshes       = @exporter.meshes

    @connected = false
    @rendering = false

  connect:()->
    if @connected
      return
    @socket = io.connect @host

    @socket.on 'connected',@onConnected
    @socket.on 'renderstart',@onRenderStart
    @socket.on 'renderprogress',@onRenderProgress
    @socket.on 'rendercomplete',@onRenderComplete

    null

  render:(scene,camera,width,height)->
    if not @connected
      throw new Error "[SunflowRenderer] Call connect() before rendering."
    else if not @rendering

      console.log "RENDER"

      scale = 1;

      @exporter.image.resolutionX = width*scale
      @exporter.image.resolutionY = height*scale

      @exporter.indexScene scene
      scContents = @exporter.exportCode()

      @socket.emit "render",
         scContents:scContents
         scPath:@scPath
         scSave:@scSave
         pngPath:@pngPath

    else
      console.log "QUEUE?"

    null

  onConnected:(data)=>
    console.log "Threeflow conected."
    @connected = true
    null

  onRenderStart:(data)=>
    console.log "onRenderStart"
    null

  onRenderProgress:(data)=>
    console.log "onRenderProgress"
    null

  onRenderComplete:(data)=>
    console.log "onRenderComplete"
    null


