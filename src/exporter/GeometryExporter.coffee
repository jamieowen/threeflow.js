
class GeometryExporter extends BlockExporter

  constructor:()->
    super()

    @settings =
      enabled: true

    @geometryIndex = {}

  addToIndex:(object3d)->
    if object3d instanceof THREE.Mesh
      if object3d.geometry and not @geometryIndex[object3d.geometry.uuid]
        @geometryIndex[object3d.geometry.uuid] = object3d.geometry

    null

  doTraverse:(object3d)->
    # TODO . Look at not indexing geometry in non traversed meshes. ( custom cameras, area light boundaries, etc )
    true

  exportBlock:()->
    result = ''

    if not @settings.enabled
      return result
        
    for uuid of @geometryIndex
      geometry = @geometryIndex[uuid]
      result += 'object {\n'
      result += '  noinstance\n'
      result += '  type generic-mesh\n'
      result += '  name ' + geometry.uuid + '\n'
      result += '  points ' + geometry.vertices.length + '\n'

      for vertex in geometry.vertices
        result += '    ' + @exportVector(vertex) + '\n'

      result += '  triangles ' + geometry.faces.length + '\n'
      for face in geometry.faces
        result += '    ' + @exportFace(face) + '\n'

      # TODO: normals and uvs.
      result += '  normals none\n'
      result += '  uvs none\n'
      result += '}\n\n'

    return result