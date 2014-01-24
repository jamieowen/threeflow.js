
THREE = window.THREE || {}

THREE.SunflowRenderer = class SunflowRenderer

  # http://wiki.panotools.org/PanoTools_Anti_Aliasing_Filters
  @IMAGE_FILTERS = ['box','triangle','gaussian','mitchell','catmull-rom','blackman-harris','sinc','lanczos','ospline']
  @GI_TYPES = ['igi','irr-cache','path','ambocc','fake']
  @IRR_CACHE_MAP_TYPES = [ 'grid','path' ]
  @BUCKET_ORDERS = [ 'hilbert','spiral','column','row','diagonal','random' ]

  constructor:(options)->
    options = options || {}

    @port = options.port || 3000
    @host = options.host || "http://localhost"

    @exporter = new Exporter()

    @connected = false
    @rendering = false

    @imageSettings =
      enabled: true
      resolutionX: 800
      resolutionY: 600
      antialiasMin: 0
      antialiasMax: 2
      samples: 4
      contrast: 0.1
      filter: THREE.SunflowRenderer.IMAGE_FILTERS[0]
      jitter: false
      bucketSize: 48
      bucketOrder: THREE.SunflowRenderer.BUCKET_ORDERS[0]
      bucketOrderReverse: false

    @traceDepthsSettings =
      enabled: false
      diffusion: 1
      reflection: 4
      refraction: 4

    @causticsSettings =
      enabled: false
      photons: 10000
      kdEstimate: 100
      kdRadius: 0.5

    @giIgiSettings =
      samples: 64
      sets: 1
      bias: 0.01
      biasSamples: 0

    @giIrrCacheSettings =
      samples: 512
      tolerance: 0.01
      spacingMin: 0.05
      spacingMax: 5.0
      globalEnabled: false
      globalPhotons: 10000
      globalMap: THREE.SunflowRenderer.IRR_CACHE_MAP_TYPES[0]
      globalEstimate: 100
      globalRadius: 0.75

    @giPathSettings =
      samples: 32

    @giAmbOccSettings =
      samples: 32
      bright: 0xffffff
      dark: 0x000000
      maxDistance: 3.0

    @giFakeSettings =
      up: new THREE.Vector3()
      sky: 0x000000
      ground: 0xffffff

    @gui = new DatGUI @



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
      #scContents = ScExporter.export scene,camera,width,height
      #console.log scContents
      #@socket.emit "render",
      #   scFile:scContents

      @exporter.indexScene scene
      console.log @exporter.exportCode()

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


