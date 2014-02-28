
class ModifiersExporter extends BlockExporter

  constructor:(exporter)->
    super(exporter)

    @modifiersIndex = {}

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
        console.log "[Threeflow] Found bumpMap texture on material but no texture linkage. ( Use linkTexturePath() )"
        # no export.
      else
        result += 'modifier {\n'
        result += '  name ' + material.uuid + '-MOD\n'  # add suffix as material uuid already in use.
        result += '  type bump\n'
        result += '  texture ' + texturePath + '\n'
        #result += '  scale ' + material.bumpScale + '\n'
        result += '  scale -0.01\n'
        result += '}\n'

    return result

