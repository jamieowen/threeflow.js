
THREE = window.THREE || {}

THREE.SunflowRenderer = class SunflowRenderer

  constructor:(options)->
    options = options || {}

    @port = options.port || 3000
    @host = options.host || "http://localhost"

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


