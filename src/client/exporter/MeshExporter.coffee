
class MeshExporter extends BlockExporter

  constructor:(exporter)->
    super(exporter)

    @convertPrimitives = true

    @meshIndex = {}

  addToIndex:(object3d)->
    if not (object3d instanceof THREE.Mesh)
      return

    if not @meshIndex[object3d.uuid]
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

      else if mesh.material instanceof THREE.MeshFaceMaterial
        result += 'instance {\n'
        result += '  name ' + mesh.uuid + '\n'
        result += '  geometry ' + mesh.geometry.uuid + '\n'
        result += '  transform col' + @exportTransform(mesh) + '\n'
        result += '  shaders ' + mesh.material.materials.length + '\n'
        for material in mesh.material.materials
          result += '    ' + material.uuid + '\n'

      else
        result += 'instance {\n'
        result += '  name ' + mesh.uuid + '\n'
        result += '  geometry ' + mesh.geometry.uuid + '\n'
        result += '  transform col' + @exportTransform(mesh) + '\n'
        result += '  shader ' + mesh.material.uuid + '\n'

        if mesh.material.bumpMap
          result += '  modifier ' + mesh.material.uuid + '-MOD\n'


      result += '}\n\n'

    return result