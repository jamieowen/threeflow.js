THREEFLOW.GlassMaterial = class GlassMaterial

  constructor:(params = {})->

    params.color = 0xffffff if params.color is undefined

    params.eta = 1.0 if params.eta is undefined

    @eta = params.eta
    ###
    # No support yet
    @absorptionDistance = params.absorptionDistance || 5.0

    if typeof params.absorptionColor is THREE.Color
      @absorptionColor = params.absorptionColor
    else if typeof params.absorptionColor is 'number'
      @absorptionColor = new THREE.Color( params.absorptionColor )
    else
      @absorptionColor = new THREE.Color( 0xffffff )
    ###

    THREE.MeshPhongMaterial.call @
    @setValues params

  @:: = Object.create THREE.MeshPhongMaterial::