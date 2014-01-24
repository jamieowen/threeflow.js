
class ImageSettingsExporter extends BlockExporter

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

    @imageSettings =
      resolutionX: 800
      resolutionY: 600
      antialiasMin: 0
      antialiasMax: 2
      samples: 4
      contrast: 0.1
      filter: ImageSettingsExporter.FILTERS[0]
      jitter: false
      bucketSize: 48
      bucketOrder: THREE.SunflowRenderer.BUCKET_ORDERS[0]
      bucketOrderReverse: false

  settings:()->
    return @imageSettings

  addToIndex:(object3d)->
    null

  doTraverse:(object3d)->
    true

  # override.
  # Determines if the
  doTraverse:(object3d)->
    throw new Error 'BlockExporter subclasses must override this method.'

  exportBlock:()->
    result = ''

    result += 'image {\n'
    result += '  resolution ' + @imageSettings.resolutionX + ' ' + @imageSettings.resolutionY + '\n'
    result += '  aa ' + @imageSettings.antialiasMin + ' ' + @imageSettings.antialiasMax + '\n'
    result += '  samples ' + @imageSettings.samples + '\n'
    result += '  contrast ' + @imageSettings.contrast + '\n'
    result += '  filter ' + @imageSettings.filter + '\n'
    result += '  jitter ' + @imageSettings.jitter + '\n'

    # format bucket options.
    bucket = @imageSettings.bucketSize + ' '
    if @imageSettings.bucketOrderReverse
      bucket += '"reverse ' + @imageSettings.bucketOrder + '"'
    else
      bucket += @imageSettings.bucketOrder

    result += '  bucket ' + bucket + '\n'
    result += '}\n\n'

    return result






