THREEFLOW.ConstantMaterial = class ConstantMaterial

  constructor:(params = {})->

    THREE.MeshLambertMaterial.call @

    @setValues params

  @:: = Object.create THREE.MeshLambertMaterial::