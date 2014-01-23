
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
      enabled: true
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


  handles:(object3d)->
    return null

  settings:()->
    return @imageSettings

  export:(object3d)->
    result = ''
    if enabled
      result

    return result





