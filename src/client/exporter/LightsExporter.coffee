
class LightsExporter extends BlockExporter

  constructor:()->
    super()

    @lightIndex = {}

  addToIndex:(object3d)->
    if object3d instanceof THREE.SF.PointLight and not @lightIndex[object3d.uuid]
      @lightIndex[object3d.uuid] = object3d
    else if object3d instanceof THREE.SF.SunskyLight and not @lightIndex[object3d.uuid]
      @lightIndex[object3d.uuid] = object3d

    null

  doTraverse:(object3d)->
    not ( (object3d instanceof THREE.SF.PointLight) or (object3d instanceof THREE.SF.SunskyLight) )

  exportBlock:()->
    result = ''

    for uuid of @lightIndex
      light = @lightIndex[ uuid ]

      if light instanceof THREE.SF.SunskyLight
        result += 'light {\n'
        result += '  type sunsky\n'
        result += '  up ' + @exportVector(light.up) + '\n'
        result += '  east ' + @exportVector(light.east) + '\n'
        result += '  sundir ' + @exportVector(light.direction) + '\n'
        result += '  turbidity ' + light.turbidity + '\n'
        result += '  samples ' + light.samples + '\n'
        result += '}\n\n'
      else if light instanceof THREE.SF.PointLight
        result += 'light {\n'
        result += '  type point\n'
        result += '  color ' + @exportColorTHREE(light.color) + '\n'
        result += '  power ' + light.intensity*200 + ' \n'
        result += '  p ' + @exportVector(light.position)+ '\n'
        result += '}\n\n'

    return result