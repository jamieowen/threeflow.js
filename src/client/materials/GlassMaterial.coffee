THREEFLOW.GlassMaterial = class GlassMaterial extends THREE.MeshPhongMaterial

  constructor:(parameters)->
    super()
    parameters = parameters || {}

    @eta = parameters.eta || 1.0
    @absorptionDistance = parameters.absorptionDistance || 5.0

    if typeof parameters.absorptionColor is THREE.Color
      @absorptionColor = parameters.absorptionColor
    else if typeof parameters.absorptionColor is 'number'
      @absorptionColor = new THREE.Color( parameters.absorptionColor )
    else
      @absorptionColor = new THREE.Color( 0xffffff )

    THREE.MeshPhongMaterial.call @
    @setValues parameters