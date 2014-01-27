
class GiExporter extends BlockExporter

  @GLOBAL_MAP_TYPES = ['grid','path']
  @TYPES         = ['igi','irr-cache','path','ambocc','fake']

  constructor:()->
    @type = GiExporter.TYPES[0]
    @enabled = false

    @irrCacheSettings =
      samples: 512
      tolerance: 0.01
      spacingMin: 0.05
      spacingMax: 5.0
      globalEnabled: false
      globalPhotons: 10000
      globalMap: GiExporter.GLOBAL_MAP_TYPES[0]
      globalEstimate: 100
      globalRadius: 0.75

    @igiSettings =
      samples: 64
      sets: 1
      bias: 0.01
      biasSamples: 0

    @pathSettings =
      samples: 32

    @ambOccSettings =
      samples: 32
      bright: 0xffffff
      dark: 0x000000
      maxDistance: 3.0

    @fakeSettings =
      upX: 0
      upY: 1
      upZ: 0
      sky: 0x000000
      ground: 0xffffff

  addToIndex:(object3d)->
    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    if not @enabled
      return result

    result += 'gi {\n'
    result += '  type ' + @type + '\n'

    if @type is 'igi'
      result += '  samples ' + @igiSettings.samples + '\n'
      result += '  sets ' + @igiSettings.sets + '\n'
      result += '  b ' + @igiSettings.bias + '\n'
      result += '  bias-samples ' + @igiSettings.biasSamples + '\n'

    else if @type is 'irr-cache'
      result += '  samples ' + @irrCacheSettings.samples + '\n'
      result += '  tolerance ' + @irrCacheSettings.tolerance + '\n'
      result += '  spacing ' + @irrCacheSettings.spacingMin + ' ' + @irrCacheSettings.spacingMax + '\n'

      if @irrCacheSettings.globalEnabled
        global = 'global '
        global += @irrCacheSettings.globalPhotons + ' '
        global += @irrCacheSettings.globalMap + ' '
        global += @irrCacheSettings.globalEstimate + ' '
        global += @irrCacheSettings.globalRadius + '\n'
        result += global

    else if @type is 'path'
      result += 'samples ' + @pathSettings.samples + '\n'

    else if @type is 'ambocc'
      result += 'bright { "sRGB nonlinear" 1 1 1 }' + '\n'
      result += 'dark { "sRGB nonlinear" 0 0 0 }' + '\n'
      result += 'samples ' + @ambOccSettings.samples + '\n'
      result += 'maxdist ' + @ambOccSettings.maxDistance + '\n'

    else if @type is 'fake'
      result += 'up ' + @ambOccSettings.upX + ' ' + @ambOccSettings.upY + ' ' + @ambOccSettings.upZ
      # TODO : Color parsing.
      result += 'sky { "sRGB nonlinear" 0 0 0 }'
      result += 'ground { "sRGB nonlinear" 1 1 1 }'

    result += '}\n\n'

    return result






