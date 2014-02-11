
class LightsExporter extends BlockExporter

  constructor:()->
    super()

    @lightIndex = {}

  addToIndex:(object3d)->
    indexed = @lightIndex[object3d.uuid]

    if not indexed and object3d instanceof THREEFLOW.SunskyLight
      @lightIndex[object3d.uuid] = object3d

    else if not indexed and object3d instanceof THREEFLOW.PointLight
      @lightIndex[object3d.uuid] = object3d

    else if not indexed and object3d instanceof THREEFLOW.AreaLight
      @lightIndex[object3d.uuid] = object3d


    null

  doTraverse:(object3d)->
    if object3d instanceof THREEFLOW.PointLight
      false
    else if object3d instanceof THREEFLOW.SunskyLight
      false
    else if object3d instanceof THREEFLOW.AreaLight
      false

  exportBlock:()->
    result = ''

    for uuid of @lightIndex
      light = @lightIndex[ uuid ]

      # Sunsky Light
      if light instanceof THREEFLOW.SunskyLight
        result += 'light {\n'
        result += '  type sunsky\n'
        result += '  up ' + @exportVector(light.up) + '\n'
        result += '  east ' + @exportVector(light.east) + '\n'
        result += '  sundir ' + @exportVector(light.direction) + '\n'
        result += '  turbidity ' + light.turbidity + '\n'
        result += '  samples ' + light.samples + '\n'
        result += '}\n\n'

      # Point Light
      else if light instanceof THREEFLOW.PointLight
        result += 'light {\n'
        result += '  type point\n'
        result += '  color ' + @exportColorTHREE(light.color) + '\n'
        result += '  power ' + light.power + ' \n'
        result += '  p ' + @exportVector(light.position)+ '\n'
        result += '}\n\n'

      # Area Light ( Mesh Light with simple PlaneGeometry )
      else if light instanceof THREEFLOW.AreaLight
        result += 'light {\n'
        result += '  type meshlight\n'
        result += '  name ' + light.uuid + '\n'
        result += '  emit ' + @exportColorTHREE(light.color) + '\n'
        result += '  radiance ' + light.radiance + ' \n'
        result += '  samples ' + light.samples + ' \n'

        result += '  points ' + light.geometry.vertices.length + '\n'
        for vertex in light.geometry.vertices
          result += '    ' + @exportVector(vertex) + '\n'

        result += '  triangles ' + light.geometry.faces.length + '\n'
        for face in light.geometry.faces
          result += '    ' + @exportFace(face) + '\n'

        result += '}\n\n'



    return result