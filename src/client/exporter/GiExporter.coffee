
class GiExporter extends BlockExporter

  @GLOBAL_MAP_TYPES = ['grid','path']
  @TYPES         = ['igi','irr-cache','path','ambocc','fake']

  constructor:()->
    @type = GiExporter.TYPES[0]
    @enabled = false

    # various type settings

    @globalMapTypes = GiExporter.GLOBAL_MAP_TYPES

    @types = GiExporter.TYPES

    @irrCache =
      samples: 512
      tolerance: 0.01
      spacingMin: 0.05
      spacingMax: 5.0
      globalEnabled: false
      globalPhotons: 10000
      globalMap: GiExporter.GLOBAL_MAP_TYPES[0]
      globalEstimate: 100
      globalRadius: 0.75

    @igi =
      samples: 64
      sets: 1
      bias: 0.01
      biasSamples: 0

    @path =
      samples: 32

    @ambOcc =
      samples: 32
      bright: 0xffffff
      dark: 0x000000
      maxDistance: 3.0

    @fake =
      up: new THREE.Vector3 0,1,0
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
      result += '  samples ' + @igi.samples + '\n'
      result += '  sets ' + @igi.sets + '\n'
      result += '  b ' + @igi.bias + '\n'
      result += '  bias-samples ' + @igi.biasSamples + '\n'

    else if @type is 'irr-cache'
      result += '  samples ' + @irrCache.samples + '\n'
      result += '  tolerance ' + @irrCache.tolerance + '\n'
      result += '  spacing ' + @irrCache.spacingMin + ' ' + @irrCache.spacingMax + '\n'

      if @irrCache.globalEnabled
        global = '  global '
        global += @irrCache.globalPhotons + ' '
        global += @irrCache.globalMap + ' '
        global += @irrCache.globalEstimate + ' '
        global += @irrCache.globalRadius + '\n'
        result += global

    else if @type is 'path'
      result += 'samples ' + @path.samples + '\n'

    else if @type is 'ambocc'
      result += '  bright { "sRGB nonlinear" 1 1 1 }' + '\n'
      result += '  dark { "sRGB nonlinear" 0 0 0 }' + '\n'
      result += '  samples ' + @ambOcc.samples + '\n'
      result += '  maxdist ' + @ambOcc.maxDistance + '\n'

    else if @type is 'fake'
      result += '  up ' + @exportVector @fake.up + '\n'
      # TODO : Color parsing.
      result += '  sky { "sRGB nonlinear" 0 0 0 }' + '\n'
      result += '  ground { "sRGB nonlinear" 1 1 1 }' + '\n'

    result += '}\n\n'

    return result






