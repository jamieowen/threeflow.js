
class GeometryExporter extends BlockExporter

  constructor:()->
    super()

    @geometryIndex = {}

  addToIndex:(object3d)->
    # TODO : Skip Primitives Geometry when converting to sunflow primitives.
    if object3d instanceof THREE.Mesh and object3d.geometry

      # check if this mesh has a MeshFaceMaterial to define face materialIndexes
      faceMaterials = object3d.material instanceof THREE.MeshFaceMaterial

      if not @geometryIndex[object3d.geometry.uuid]
        @geometryIndex[object3d.geometry.uuid] =
          geometry: object3d.geometry
          faceMaterials:  faceMaterials
      else if not @geometryIndex[object3d.geometry.uuid].faceMaterials and faceMaterials
        # if we already have this geometry but no face material we may have more than one instance of this
        # geometry with face materials defined. We would then need to store face materialIndexes.
        # *Note* Not sure if we should define this as another geometry/generic-mesh instance
        # or sunflow will allow us to create an instance without satisfying all shaders.
        @geometryIndex[object3d.geometry.uuid].faceMaterials = true

    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''
        
    for uuid of @geometryIndex
      entry = @geometryIndex[uuid]
      result += 'object {\n'
      result += '  noinstance\n'
      result += '  type generic-mesh\n'
      result += '  name ' + uuid + '\n'
      result += '  points ' + entry.geometry.vertices.length + '\n'

      for vertex in entry.geometry.vertices
        result += '    ' + @exportVector(vertex) + '\n'

      result += '  triangles ' + entry.geometry.faces.length + '\n'

      faceMaterialResult = ''
      for face in entry.geometry.faces
        result += '    ' + @exportFace(face) + '\n'
        faceMaterialResult += '    ' + face.materialIndex + '\n'

      # TODO: normals and uvs.
      result += '  normals none\n'
      result += '  uvs none\n'

      if entry.faceMaterials
        result += '  face_shaders\n'
        result += faceMaterialResult

      result += '}\n\n'

    return result