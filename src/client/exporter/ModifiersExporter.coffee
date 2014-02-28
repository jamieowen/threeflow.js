
class ModifiersExporter extends BlockExporter

  constructor:(exporter)->
    super(exporter)

    @modifiersIndex = {}

  addToIndex:(object3d)->
    if not object3d instanceof THREE.Mesh
      return

    material = object3d.material

    if not @modifiersIndex[material.uuid] and material.bumpMap
      @modifiersIndex[material.uuid] = material

    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    return result

