
THREE = window.THREE || {}

THREE.SunflowRenderer = class SunflowRenderer

  # http://wiki.panotools.org/PanoTools_Anti_Aliasing_Filters
  @IMAGE_FILTERS = ['box','triangle','gaussian','mitchell','catmull-rom','blackman-harris','sinc','lanczos','ospline']
  @GI_TYPES = ["igi"]

  constructor:(options)->
    options = options || {}

    @port = options.port || 3000
    @host = options.host || "http://localhost"

    @connected = false
    @rendering = false

    @imageSettings =
      resolutionX: 800
      resolutionY: 600
      antialiasMin: 0
      antialiasMax: 2
      samples: 4
      contrast: 0.1
      filter: THREE.SunflowRenderer.IMAGE_FILTERS[0]
      jitter: false
      # TODO: bucket size/order ?

    @traceDepthsSettings =
      enabled: false
      diffusion: 1
      reflection: 4
      refraction: 4

    @causticsSettings =
      @enabled: false
      @photons: 10000
      @kdEstimate: 100
      @kdRadius: 0.5

    # TODO: GI Type settings.
    @giSettings =
      type: THREE.SunflowRenderer.GI_TYPES[0]
      samples: 64
      sets: 1


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

      #scContents = document.getElementById("scCornellBox").innerHTML
      scContents = ScExporter.export scene,camera,width,height
      console.log scContents
      @socket.emit "render",
         scFile:scContents

    else
      console.log "QUEUE?"

    null

  onConnected:(data)=>
    console.log "Sunflow conected."
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


