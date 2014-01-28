class DatGUI
  constructor:(@renderer)->
    @create()

  create:()->
    @gui = new dat.GUI()

    @folderNameMap =
      ImageExporter: "Image Settings"
      TraceDepthsExporter: "Trace Depths"
      CausticsExporter: "Caustics"
      GiExporter: "Global Illumination"
      CameraExporter: "Camera"
      LightsExporter: "Lights"
      MaterialsExporter: "Materials"
      GeometryExporter: "Geometry"
      MeshExporter:"Mesh"


    for exporter in @renderer.exporter.blockExporters
      if exporter instanceof GiExporter
        folder = @gui.addFolder @folderNameMap[exporter.constructor.name]
        folder.add exporter,'enabled'
        folder.add exporter,'type',GiExporter.TYPES

      else
        folder = @gui.addFolder @folderNameMap[exporter.constructor.name]
        for prop of exporter.settings
          if exporter instanceof ImageExporter and prop is "filter"
            folder.add exporter.settings, prop, ImageExporter.FILTERS
          else
            folder.add exporter.settings, prop



    ###
    @imageFolder = @gui.addFolder "Image Settings"
    @imageFolder.add(@renderer.imageSettings,'resolutionX')
    @imageFolder.add @renderer.imageSettings,'resolutionY'
    @imageFolder.add @renderer.imageSettings,'antialiasMin'
    @imageFolder.add @renderer.imageSettings,'antialiasMax'
    @imageFolder.add @renderer.imageSettings,'samples'
    @imageFolder.add @renderer.imageSettings,'contrast'
    @imageFolder.add @renderer.imageSettings,'filter', THREE.SunflowRenderer.IMAGE_FILTERS
    @imageFolder.add @renderer.imageSettings,'jitter'

    ###


    null





