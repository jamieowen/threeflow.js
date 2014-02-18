THREEFLOW.DiffuseMaterial = class DiffuseMaterial

  constructor:(params = {})->

    params.color = 0xffffff if params.color is undefined

    THREE.MeshLambertMaterial.call @

    @setValues params

  @:: = Object.create THREE.MeshLambertMaterial::
