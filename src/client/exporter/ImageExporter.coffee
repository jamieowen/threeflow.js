
class ImageExporter extends BlockExporter

  # http://wiki.panotools.org/PanoTools_Anti_Aliasing_Filters
  @FILTERS = [
    'box'
    'triangle'
    'gaussian'
    'mitchell'
    'catmull-rom'
    'blackman-harris'
    'sinc'
    'lanczos'
    'ospline' ]

  constructor:(exporter)->
    super(exporter)

    @resolutionX    = 800
    @resolutionY    = 600
    @antialiasMin   = -1
    @antialiasMax   = 1
    @samples        = 2
    @contrast       = 0.1
    @filter         = ImageExporter.FILTERS[0]
    @jitter         = true

    @filterTypes    = ImageExporter.FILTERS

  clean:()->
    null

  addToIndex:(object3d)->
    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    result += 'image {\n'
    result += '  resolution ' + @resolutionX + ' ' + @resolutionY + '\n'
    result += '  aa ' + @antialiasMin + ' ' + @antialiasMax + '\n'
    result += '  samples ' + @samples + '\n'
    result += '  contrast ' + @contrast + '\n'
    result += '  filter ' + @filter + '\n'
    result += '  jitter ' + @jitter + '\n'
    result += '}\n\n'

    # putting some extras here for now..
    result += "accel kdtree\n\n"

    return result






