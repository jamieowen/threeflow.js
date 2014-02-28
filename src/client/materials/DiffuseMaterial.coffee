THREEFLOW.DiffuseMaterial = class DiffuseMaterial

  constructor:(params = {})->

    params.color = 0xffffff if params.color is undefined

    THREE.MeshPhongMaterial.call @

    @setValues params

  @:: = Object.create THREE.MeshPhongMaterial::
