
class LightsExporter extends BlockExporter

  constructor:()->
    super()

    @settings =
      enabled: true
      sunskyEnabled: true
      sunskyUpX: 0
      sunskyUpY: 0
      sunskyUpZ: 1
      sunskyEastX: 0
      sunskyEastY: 1
      sunskyEastZ: 0
      sunskyDirX: 0.5
      sunskyDirY: 0.2
      sunskyDirZ: 0.8
      sunskyTurbidity: 0.6
      sunskySamples: 128

    @lightIndex = {}


  addToIndex:(object3d)->
    # handle scene lights. TODO
    if object3d instanceof THREE.Light and not @lightIndex[object3d.uuid]
      @lightIndex[object3d.uuid] = object3d

    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    if not @settings.enabled
      return result

    if @settings.sunskyEnabled
      result += 'light {\n'
      result += '  type sunsky\n'
      result += '  up ' + @settings.sunskyUpX + ' ' + @settings.sunskyUpY + ' ' + @settings.sunskyUpZ + '\n'
      result += '  east ' + @settings.sunskyUpX + ' ' + @settings.sunskyUpY + ' ' + @settings.sunskyUpZ + '\n'
      result += '  sundir ' + @settings.sunskyDirX + ' ' + @settings.sunskyDirY + ' ' + @settings.sunskyDirZ + '\n'
      result += '  turbidity ' + @settings.sunskyTurbidity + '\n'
      result += '  samples ' + @settings.sunskySamples + '\n'
      result += '}\n\n'

    for uuid of @lightIndex
      light = @lightIndex[ uuid ]
      # TODO handle lights.

    return result