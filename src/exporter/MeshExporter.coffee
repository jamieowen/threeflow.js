
class MeshExporter extends BlockExporter

  constructor:()->
    super()

    @settings =
      enabled: true

    @meshIndex = {}

  addToIndex:(object3d)->
    if object3d instanceof THREE.Mesh and not @meshIndex[object3d.uuid]
      @meshIndex[object3d.uuid] = object3d

    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    if not @settings.enabled
      return result

    for uuid of @meshIndex
      mesh = @meshIndex[uuid]
      result += 'instance {\n'
      result += '  name ' + mesh.uuid + '\n'
      result += '  geometry ' + mesh.geometry.uuid + '\n'
      result += '  transform col' + @exportTransform(mesh) + '\n'
      result += '  shader ' + mesh.material.uuid + '\n'
      result += '}\n\n'

    return result