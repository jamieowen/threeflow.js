THREEFLOW.MirrorMaterial = class MirrorMaterial

  constructor:(params={})->

    if params.reflection is undefined and params.color is undefined
      params.color = 0xffffff
    else if params.reflection is undefined
      params.color = params.color
    else if params.color is undefined
      params.color = params.reflection
    else
      params.color = 0xffffff

    THREE.MeshPhongMaterial.call @

    @setValues params

    @reflection = @color

  @:: = Object.create THREE.MeshPhongMaterial::