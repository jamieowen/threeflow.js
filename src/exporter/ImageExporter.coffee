
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

  constructor:()->
    super()

    @settings =
      resolutionX: 800
      resolutionY: 600
      antialiasMin: -1
      antialiasMax: 1
      samples: 2
      contrast: 0.1
      filter: ImageExporter.FILTERS[0]
      jitter: true

  addToIndex:(object3d)->
    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    result += 'image {\n'
    result += '  resolution ' + @settings.resolutionX + ' ' + @settings.resolutionY + '\n'
    result += '  aa ' + @settings.antialiasMin + ' ' + @settings.antialiasMax + '\n'
    result += '  samples ' + @settings.samples + '\n'
    result += '  contrast ' + @settings.contrast + '\n'
    result += '  filter ' + @settings.filter + '\n'
    result += '  jitter ' + @settings.jitter + '\n'
    result += '}\n\n'

    return result






