THREEFLOW.PhongMaterial = class PhongMaterial

  constructor:(params={})->

    params.color = 0xffffff if params.color is undefined
    @power = 100 if params.power is undefined
    @samples = 4 if params.samples is undefined

    THREE.MeshPhongMaterial.call @
    @setValues params

  @:: = Object.create THREE.MeshPhongMaterial::