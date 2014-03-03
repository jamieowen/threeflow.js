
class ModifiersExporter extends BlockExporter

  constructor:(exporter)->
    super(exporter)

    @modifiersIndex = null

  clean:()->
    @modifiersIndex = {}
    null

  addToIndex:(object3d)->
    if not (object3d instanceof THREE.Mesh)
      return

    material = object3d.material

    if not @modifiersIndex[material.uuid] and material.bumpMap instanceof THREE.Texture
      @modifiersIndex[material.uuid] = material

    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    for uuid of @modifiersIndex
      material = @modifiersIndex[uuid]

      # Bump Map

      texturePath = @exporter.textureLinkages[material.bumpMap.uuid]

      if not texturePath
        THREEFLOW.warn "Found bumpMap texture on material but no texture linkage.","( Use linkTexturePath() )"
        # no export.
      else
        result += 'modifier {\n'
        result += '  name ' + material.uuid + '-MOD\n'  # add suffix as material uuid already in use.
        result += '  type bump\n'
        result += '  texture ' + texturePath + '\n'
        #result += '  scale ' + ( material.bumpScale * 0.01 ) + '\n'
        result += '  scale ' + (material.bumpScale * -0.005 ) + '\n'
        result += '}\n'

    return result

