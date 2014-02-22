
window.THREEFLOW = window.THREEFLOW || {}

THREEFLOW.SunflowRenderer = class SunflowRenderer

  constructor:(options)->
    options = options || {}

    @pngPath  = options.pngPath || null
    @scPath   = options.scPath || null
    @scSave   = options.scSave || false
    @scale    = options.scale || 1

    @exporter = new Exporter()

    # map block exporters for shorthand access
    @image            = @exporter.image
    @bucket           = @exporter.bucket
    @traceDepths      = @exporter.traceDepths
    @caustics         = @exporter.caustics
    @gi               = @exporter.gi

    @cameras          = @exporter.cameras
    @lights           = @exporter.lights
    @materials        = @exporter.materials
    @geometry         = @exporter.geometry
    @bufferGeometry   = @exporter.bufferGeometry
    @meshes           = @exporter.meshes

    @connected = false
    @rendering = false

  connect:()->
    if @connected
      return
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


      @rendering = true
      console.log "RENDER"


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

  onConnected:(data)=>
    console.log "Threeflow conected."
    @connected = true
    null

  onRenderStart:(data)=>
    console.log "onRenderStart"
    null

  onRenderProgress:(data)=>
    console.log "onRenderProgress",data
    null

  onRenderComplete:(data)=>
    @rendering = false
    console.log "onRenderComplete",data
    null

  onRenderError:(data)=>
    @rendering = false
    console.log "onRenderError",data
    null


