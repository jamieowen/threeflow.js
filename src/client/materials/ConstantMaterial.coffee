THREEFLOW.ConstantMaterial = class ConstantMaterial

  constructor:(params = {})->

    THREE.MeshBasicMaterial.call @

    @setValues params

  @:: = Object.create THREE.MeshBasicMaterial::