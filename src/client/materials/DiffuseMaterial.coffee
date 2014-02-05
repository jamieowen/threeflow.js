THREE.SF.DiffuseMaterial = class DiffuseMaterial extends THREE.MeshLambertMaterial

  constructor:(parameters)->
    super()

    THREE.MeshLambertMaterial.call @
    @setValues parameters