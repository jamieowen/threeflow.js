
class MeshExporter extends BlockExporter

  constructor:()->
    super()

    @convertPrimitives = true

    @meshIndex = {}

  addToIndex:(object3d)->
    if object3d instanceof THREE.Mesh and not @meshIndex[object3d.uuid]
      @meshIndex[object3d.uuid] = object3d

    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    for uuid of @meshIndex
      mesh = @meshIndex[uuid]
      if mesh.geometry instanceof THREEFLOW.InfinitePlaneGeometry
        result += 'object {\n'
        result += '  shader ' + mesh.material.uuid + '\n'
        result += '  type plane\n'
        result += '  p ' + @exportTransformPosition(mesh) + '\n'
        result += '  n ' + @exportVector( mesh.up ) + '\n'

      else if @convertPrimitives and mesh.geometry instanceof THREE.SphereGeometry
        result += 'object {\n'
        result += '  shader ' + mesh.material.uuid + '\n'
        result += '  type sphere\n'
        result += '  name ' + mesh.uuid + '\n'
        result += '  c ' + @exportTransformPosition(mesh) + '\n'
        result += '  r ' + mesh.geometry.radius + '\n'
        #result += '  transform col' + @exportTransform(mesh) + '\n'
      else
        result += 'instance {\n'
        result += '  name ' + mesh.uuid + '\n'
        result += '  geometry ' + mesh.geometry.uuid + '\n'
        result += '  transform col' + @exportTransform(mesh) + '\n'
        result += '  shader ' + mesh.material.uuid + '\n'

      result += '}\n\n'

    return result