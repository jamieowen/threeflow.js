
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

  @BUCKET_ORDERS = [
    'hilbert'
    'spiral'
    'column'
    'row'
    'diagonal'
    'random' ]

  constructor:()->
    super()

    @settings =
      resolutionX: 800
      resolutionY: 600
      antialiasMin: 0
      antialiasMax: 2
      samples: 4
      contrast: 0.1
      filter: ImageExporter.FILTERS[0]
      jitter: false
      bucketSize: 48
      bucketOrder: ImageExporter.BUCKET_ORDERS[0]
      bucketOrderReverse: false


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

    # format bucket options.
    bucket = @settings.bucketSize + ' '
    if @settings.bucketOrderReverse
      bucket += '"reverse ' + @settings.bucketOrder + '"'
    else
      bucket += @settings.bucketOrder

    result += '  bucket ' + bucket + '\n'
    result += '}\n\n'

    return result






