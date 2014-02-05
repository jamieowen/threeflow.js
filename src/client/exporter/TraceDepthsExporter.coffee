
class TraceDepthsExporter extends BlockExporter

  constructor:()->
    super()

    @settings =
      enabled: true
      diffusion: 1
      reflection: 4
      refraction: 4

  addToIndex:(object3d)->
    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    if not @settings.enabled
      return result

    result += 'trace-depths {\n'
    result += '  diff ' + @settings.diffusion + '\n'
    result += '  refl ' + @settings.reflection + '\n'
    result += '  refr ' + @settings.refraction + '\n'
    result += '}\n\n'

    return result