THREEFLOW.ShinyMaterial = class ShinyMaterial

  constructor:(params = {})->

    params.color = 0xffffff if params.color is undefined
    params.reflection = 0.5 if params.reflection is undefined
    @reflection = params.reflection

    THREE.MeshPhongMaterial.call @
    @setValues params

  @:: = Object.create THREE.MeshPhongMaterial::