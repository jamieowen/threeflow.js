THREEFLOW.MirrorMaterial = class MirrorMaterial

  constructor:(params={})->

    THREE.MeshPhongMaterial.call @

    @setValues params

    @reflection = @color

  @:: = Object.create THREE.MeshPhongMaterial::