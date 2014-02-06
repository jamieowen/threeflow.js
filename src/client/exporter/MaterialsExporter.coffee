
class MaterialsExporter extends BlockExporter

  constructor:()->
    super()

    @materialsIndex = {}

  addToIndex:(object3d)->
    if object3d instanceof THREE.Mesh

      # index all unique material instances.
      if object3d.material and not @materialsIndex[object3d.material.uuid]
        @materialsIndex[object3d.material.uuid] = object3d.material

    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    for uuid of @materialsIndex
      material = @materialsIndex[ uuid ]

      result += 'shader {\n'
      result += '  name ' + material.uuid + '\n'

      if material instanceof THREEFLOW.ConstantMaterial or material instanceof THREE.MeshBasicMaterial
        result += '  type constant\n'
        result += '  color ' + @exportColorTHREE(material.color) + '\n'

      else if material instanceof THREEFLOW.DiffuseMaterial or material instanceof THREE.MeshLambertMaterial
        result += '  type diffuse\n'
        result += '  diff ' + @exportColorTHREE(material.color) + '\n'

      else if material instanceof THREEFLOW.ShinyMaterial
        result += '  type shiny\n'
        result += '  diff ' + @exportColorTHREE(material.color) + '\n'
        result += '  refl ' + material.reflection + '\n'

      else if material instanceof THREEFLOW.GlassMaterial
        result += '  type glass\n'
        result += '  eta ' + material.eta + '\n'
        result += '  color ' + @exportColorTHREE(material.color) + '\n'
        # TODO : Look into these properties.
        #result += '  absorption.distance ' + material.absorptionDistance + '\n'
        #result += '  absorption.color ' + @exportColorTHREE(material.absorptionColor) + '\n'
      else if material instanceof THREEFLOW.MirrorMaterial
        result += '  type mirror\n'
        result += '  refl ' + @exportColorTHREE(material.reflection) + '\n'

      # Keep PhongMaterial last as currently the above sunflow materials extend from THREE.MeshPhongMaterial
      # This should probably change.
      else if material instanceof THREEFLOW.PhongMaterial or material instanceof THREE.MeshPhongMaterial
        result += '  type phong\n'
        result += '  diff ' + @exportColorTHREE(material.color) + '\n'
        result += '  spec ' + @exportColorTHREE(material.specular) + ' ' + material.shininess + '\n'
        # default to 4 for handling THREE.MeshPhongMaterial
        result += '  samples ' + ( material.samples || 4 ) + '\n'

      result += '}\n\n'

    return result