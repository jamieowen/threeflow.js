THREEFLOW.MirrorMaterial = class MirrorMaterial extends THREE.MeshPhongMaterial

  constructor:(parameters)->
    super()
    parameters = parameters || {}

    if typeof parameters.reflection is THREE.Color
      @reflection = parameters.reflection
    else if typeof parameters.reflection is 'number'
      @reflection = new THREE.Color( parameters.reflection )
    else
      @reflection = new THREE.Color( 0xffffff )

    THREE.MeshPhongMaterial.call @
    @setValues parameters