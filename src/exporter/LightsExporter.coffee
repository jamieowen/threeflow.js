
class LightsExporter extends BlockExporter

  constructor:()->
    super()

    @settings =
      enabled: true
      sunskyEnabled: true
      sunskyUpX: 0
      sunskyUpY: 1
      sunskyUpZ: 0
      sunskyEastX: 0
      sunskyEastY: 0
      sunskyEastZ: 1
      sunskyDirX: 1
      sunskyDirY: 1
      sunskyDirZ: 1
      sunskyTurbidity: 6
      sunskySamples: 64

    @lightIndex = {}


  addToIndex:(object3d)->
    # handle scene lights. TODO
    if object3d instanceof THREE.Light and not @lightIndex[object3d.uuid]
      @lightIndex[object3d.uuid] = object3d

    null

  doTraverse:(object3d)->
    not (object3d instanceof THREE.SF.PointLight)

  exportBlock:()->
    result = ''

    if not @settings.enabled
      return result

    if @settings.sunskyEnabled
      result += 'light {\n'
      result += '  type sunsky\n'
      result += '  up ' + @settings.sunskyUpX + ' ' + @settings.sunskyUpY + ' ' + @settings.sunskyUpZ + '\n'
      result += '  east ' + @settings.sunskyEastX + ' ' + @settings.sunskyEastY + ' ' + @settings.sunskyEastZ + '\n'
      result += '  sundir ' + @settings.sunskyDirX + ' ' + @settings.sunskyDirY + ' ' + @settings.sunskyDirZ + '\n'
      result += '  turbidity ' + @settings.sunskyTurbidity + '\n'
      result += '  samples ' + @settings.sunskySamples + '\n'
      result += '}\n\n'

    for uuid of @lightIndex
      light = @lightIndex[ uuid ]
      if light instanceof THREE.SF.PointLight
        result += 'light {\n'
        result += '  type point\n'
        result += '  color ' + @exportColorTHREE(light.color) + '\n'
        result += '  power ' + light.intensity*200 + ' \n'
        result += '  p ' + @exportVector(light.position)+ '\n'
      result += '}\n\n'



    return result