
class Exporter

  constructor:()->

    console.log "New Exporter"

    # global exporter settings
    @exporterSettings =
      convertPrimitives: false

    # register code block exporters.
    @blockExporters = []

    # register block exporters.
    @addBlockExporter new ImageSettingsExporter()
    #@addBlockExporter new CausticsSettingsExporter()
    #@addBlockExporter new GiSettingsExporter()
    #@addBlockExporter new TraceDepthsExporter()

    #@addBlockExporter new CamerasExporter()
    #@addBlockExporter new LightsExporter()
    #@addBlockExporter new MaterialsExporter()
    #@addBlockExporter new GeometryExporter()
    #@addBlockExporter new MeshExporter()


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

  render:()->

    matrix = new Matrix()
    matrix.identity()

    traverse( scene, matrix )



  traverse:(object3d)->
    for child in object3d.children
      # do something.

      if child.children.length
        traverse child

    null

  exportCode:()->
    result = ''

    for blockExporter in @blockExporters
      result += blockExporter.exportBlock()

    return result




