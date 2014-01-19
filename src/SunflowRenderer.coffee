
THREE = window.THREE || {}

THREE.SunflowRenderer = class SunflowRenderer
  constructor:(options)->
    options = options || {}

    @port = options.port || 3000
    @host = options.host || "localhost"


  render:()->
    console.log "Render"
    null
