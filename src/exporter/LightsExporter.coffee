
class LightsExporter extends BlockExporter

  constructor:()->
    super()

    @settings =
      enabled: true

  addToIndex:(object3d)->
    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    if not @settings.enabled
      return result

    result += 'lights{\n'
    result += '}\n\n'

    return result