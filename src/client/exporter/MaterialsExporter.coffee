
class MaterialsExporter extends BlockExporter

  constructor:(exporter)->
    super(exporter)

    @materialsIndex = null

  clean:()->
    @materialsIndex = {}
    null


  addToIndex:(object3d)->
    if object3d instanceof THREE.Mesh

      if object3d.material instanceof THREE.MeshFaceMaterial
        # don't index the face material just index its sub materials.
        for material in object3d.material.materials
          if not @materialsIndex[material.uuid]
            @materialsIndex[ material.uuid ] = material

      else if object3d.material and not @materialsIndex[object3d.material.uuid]
        @materialsIndex[object3d.material.uuid] = object3d.material

    null

  doTraverse:(object3d)->
    true

  declareDiffOrTexture:(material)->

    result = ''
    hasTexture = material.map instanceof THREE.Texture
    if hasTexture
      texturePath = @exporter.textureLinkages[material.map.uuid]
    else
      texturePath = null

    if hasTexture and not texturePath
      THREEFLOW.warn "Found texture on material but no texture linkage.","( Use linkTexturePath() )"
      hasTexture = false

    if hasTexture
      result += '  texture "' + texturePath + '"\n'
    else
      result += '  diff ' + @exportColorTHREE(material.color) + '\n'

    result


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
        result += @declareDiffOrTexture material

      else if material instanceof THREEFLOW.ShinyMaterial

        result += '  type shiny\n'
        result += @declareDiffOrTexture material
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

      else if material instanceof THREEFLOW.PhongMaterial or material instanceof THREE.MeshPhongMaterial
        # ? Keep PhongMaterial last as currently the above sunflow materials extend from THREE.MeshPhongMaterial

        result += '  type phong\n'
        result += @declareDiffOrTexture material
        result += '  spec ' + @exportColorTHREE(material.specular) + ' ' + material.shininess + '\n'

        # default to 4 for handling THREE.MeshPhongMaterial
        result += '  samples ' + ( material.samples || 4 ) + '\n'
      else
        THREEFLOW.warn "Unsupported Material type. Will map to black THREEFLOW.DiffuseMaterial.",material
        result += '  type diffuse\n'
        result += '  diff { "sRGB nonlinear" 0 0 0 }\n'

      result += '}\n\n'

    return result