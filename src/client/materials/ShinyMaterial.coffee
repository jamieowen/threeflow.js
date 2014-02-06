THREEFLOW.ShinyMaterial = class ShinyMaterial extends THREE.MeshPhongMaterial

  constructor:(parameters)->
    super()
    parameters = parameters || {}
    @reflection = parameters.reflection || 0.5

    THREE.MeshPhongMaterial.call @
    @setValues parameters