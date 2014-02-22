
class Exporter

  constructor:()->
    # global exporter settings
    @exporterSettings =
      convertPrimitives: false

    @blockExporters = []

    @image              = @addBlockExporter new ImageExporter(@)
    @bucket             = @addBlockExporter new BucketExporter(@)
    @traceDepths        = @addBlockExporter new TraceDepthsExporter(@)
    @caustics           = @addBlockExporter new CausticsExporter(@)
    @gi                 = @addBlockExporter new GiExporter(@)

    @cameras            = @addBlockExporter new CameraExporter(@)
    @lights             = @addBlockExporter new LightsExporter(@)
    @materials          = @addBlockExporter new MaterialsExporter(@)
    @geometry           = @addBlockExporter new GeometryExporter(@)
    @bufferGeometry     = @addBlockExporter new BufferGeometryExporter(@)
    @meshes             = @addBlockExporter new MeshExporter(@)


  addBlockExporter:(exporter)->
    if not exporter instanceof BlockExporter
      throw new Error 'Extend BlockExporter'
    else
      @blockExporters.push( exporter )

    exporter

  # index the three js scene
  indexScene:(object3d)->
    if object3d.children.length
      for child in object3d.children

        # helper to prevent traversing children further
        # to exclude elements from the render.
        doTraverse = true

        # TODO : Auto No add-to-index with certain meshes.

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




