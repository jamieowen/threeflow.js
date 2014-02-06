
class TraceDepthsExporter extends BlockExporter

  constructor:()->
    super()

    @enabled      = false
    @diffusion    = 1
    @reflection   = 4
    @refraction   = 4

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