

class BufferGeometryExporter extends BlockExporter

  constructor:(exporter)->
    super(exporter)

    @normals = true
    @uvs = false

    @bufferGeometryIndex = null

  clean:()->
    @bufferGeometryIndex = {}
    null

  addToIndex:(object3d)->

    if not object3d instanceof THREE.Mesh
      return

    if object3d.geometry instanceof THREE.BufferGeometry and not @bufferGeometryIndex[object3d.geometry.uuid]
      @bufferGeometryIndex[ object3d.geometry.uuid ] =
        geometry: object3d.geometry
        faceMaterials: false


    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    for uuid of @bufferGeometryIndex
      entry = @bufferGeometryIndex[uuid]
      result += 'object {\n'
      result += '  noinstance\n'
      result += '  type generic-mesh\n'
      result += '  name ' + uuid + '\n'

      offsets = entry.geometry.offsets
      attributes = entry.geometry.attributes
      positions = attributes.position.array
      normals = attributes.normal.array

      # points
      result += '  points ' + (positions.length/3) + '\n'

      for i in [ 0...positions.length ] by 3
        result += '    ' + positions[i] + ' ' + positions[i+1] + ' ' + positions[i+2] + '\n'

      # triangles / faces

      if attributes.index
        indices = attributes.index.array

        if offsets.length
          tris = 0
          result2 = ''
          for offset in offsets
            index = offset.index

            for i in [offset.start...(offset.start+offset.count)] by 3
              tris++
              result2 += '    ' + (indices[i]+index) + ' ' + (indices[i+1]+index) + ' ' + (indices[i+2]+index) + '\n'

          result += '  triangles ' + tris + '\n'
          result += result2

        else
          result += '  triangles ' + (indices.length/3) + '\n'
          for i in [0...indices.length] by 3
            result += '    ' + indices[i] + ' ' + indices[i+1] + ' ' + indices[i+2] + '\n'

      else
        result += '  triangles ' + (positions.length/9) + '\n'
        for i in [0...(positions.length/3)] by 3
          result += '    ' + i + ' ' + (i+1) + ' ' + (i+2) + '\n'

      if @normals and normals.length > 0
        result += '  normals vertex\n'

        for i in [0...normals.length] by 3
            result += '    ' + normals[i] + ' ' + normals[i+1] + ' ' + normals[i+2] + '\n'

        result += '\n'
      else
        result += '  normals none\n'

      if @uvs
        result += '  uvs none\n'
      else
        result += '  uvs none\n'

      if entry.faceMaterials
        result += '  face_shaders\n'
        for face in entry.geometry.faces
          result += '    ' + face.materialIndex + '\n'

      result += '}\n\n'

    return result
