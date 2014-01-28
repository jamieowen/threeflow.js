
THREE.SF.ConstantMaterial = class ConstantMaterial extends THREE.MeshPhongMaterial

  constructor:(parameters)->
    super()
    THREE.MeshPhongMaterial.call @
    @setValues parameters