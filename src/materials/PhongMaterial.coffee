THREE.SF.PhongMaterial = class PhongMaterial extends THREE.MeshPhongMaterial

constructor:(parameters)->
  super()
  parameters = parameters || {}
  @samples = parameters.samples || 4

  THREE.MeshPhongMaterial.call @
  @setValues parameters