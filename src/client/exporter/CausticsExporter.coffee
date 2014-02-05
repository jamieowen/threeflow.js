
class CausticsExporter extends BlockExporter

  constructor:()->
    super()

    @settings =
      enabled: false
      photons: 10000
      kdEstimate: 100
      kdRadius: 0.5

  addToIndex:(object3d)->
    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    if not @settings.enabled
      return result

    result += 'photons {\n'
    result += '  caustics ' + @settings.photons + ' kd ' + @settings.kdEstimate + ' ' + @settings.kdRadius + '\n'
    result += '}\n\n'

    return result

