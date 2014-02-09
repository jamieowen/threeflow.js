THREEFLOW.ConstantMaterial = class ConstantMaterial extends THREE.MeshBasicMaterial

  constructor:(parameters)->
    super()

    THREE.MeshBasicMaterial.call @
    @setValues parameters