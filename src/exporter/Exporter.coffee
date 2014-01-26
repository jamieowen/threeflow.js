
class Exporter

  constructor:()->
    # global exporter settings
    @exporterSettings =
      convertPrimitives: false

    # register code block exporters.
    @blockExporters = []

    # register block exporters.
    @addBlockExporter new ImageExporter()
    @addBlockExporter new TraceDepthsExporter()
    @addBlockExporter new CausticsExporter()
    @addBlockExporter new GiExporter()

    @addBlockExporter new CameraExporter()
    @addBlockExporter new LightsExporter()
    @addBlockExporter new MaterialsExporter()
    @addBlockExporter new GeometryExporter()
    @addBlockExporter new MeshExporter()


  addBlockExporter:(exporter)->
    if not exporter instanceof BlockExporter
      throw new Error 'Extend BlockExporter'
    else
      @blockExporters.push( exporter )

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




