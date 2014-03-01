
class CausticsExporter extends BlockExporter

  constructor:(exporter)->
    super(exporter)

    @enabled    = false
    @photons    = 10000
    @kdEstimate = 100
    @kdRadius   = 0.5

  clean:()->
    null

  addToIndex:(object3d)->
    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    if not @enabled
      return result

    result += 'photons {\n'
    result += '  caustics ' + @photons + ' kd ' + @kdEstimate + ' ' + @kdRadius + '\n'
    result += '}\n\n'

    return result

