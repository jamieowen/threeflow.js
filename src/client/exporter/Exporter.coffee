
class Exporter

  # command line options. ( or passed in single liners inside .sc code )
  # mistakenly defined in the image{} block to begin with
  @BUCKET_ORDERS = [
    'hilbert'
    'spiral'
    'column'
    'row'
    'diagonal'
    'random' ]

  ###
      bucketSize: 48
      bucketOrder: ImageExporter.BUCKET_ORDERS[0]
      bucketOrderReverse: false

    # format bucket options.
    bucket = @settings.bucketSize + ' '
    if @settings.bucketOrderReverse
      bucket += '"reverse ' + @settings.bucketOrder + '"'
    else
      bucket += @settings.bucketOrder

    result += '  bucket ' + bucket + '\n'
  ###

  constructor:()->
    # global exporter settings
    @exporterSettings =
      convertPrimitives: false

    @blockExporters = []

    @image        = @addBlockExporter new ImageExporter()
    @traceDepths  = @addBlockExporter new TraceDepthsExporter()
    @caustics     = @addBlockExporter new CausticsExporter()
    @gi           = @addBlockExporter new GiExporter()

    @cameras      = @addBlockExporter new CameraExporter()
    @lights       = @addBlockExporter new LightsExporter()
    @materials    = @addBlockExporter new MaterialsExporter()
    @geometry     = @addBlockExporter new GeometryExporter()
    @meshes       = @addBlockExporter new MeshExporter()


  addBlockExporter:(exporter)->
    if not exporter instanceof BlockExporter
      throw new Error 'Extend BlockExporter'
    else
      @blockExporters.push( exporter )

    exporter

  # index the three js scene and
  indexScene:(object3d)->
    if object3d.children.length
      for child in object3d.children

        # helper to prevent traversing children further
        # to exclude elements from the render.
        doTraverse = true

        for blockExporter in @blockExporters
          blockExporter.addToIndex( child )
          doTraverse = doTraverse and blockExporter.doTraverse( child )

        if doTraverse
          @indexScene child

    null

  exportCode:()->
    result = ''

    for blockExporter in @blockExporters
      result += blockExporter.exportBlock()

    return result




