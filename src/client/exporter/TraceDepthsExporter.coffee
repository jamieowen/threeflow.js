
class TraceDepthsExporter extends BlockExporter

  constructor:(exporter)->
    super(exporter)

    @enabled      = false
    @diffusion    = 1
    @reflection   = 1
    @refraction   = 1

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

    result += 'trace-depths {\n'
    result += '  diff ' + @diffusion + '\n'
    result += '  refl ' + @reflection + '\n'
    result += '  refr ' + @refraction + '\n'
    result += '}\n\n'

    return result