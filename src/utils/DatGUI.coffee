class DatGUI
  constructor:(@renderer)->

  create:()->
    @gui = new dat.GUI()
    @imageFolder = @gui.addFolder "Image Settings"
    @imageFolder.add(@renderer.imageSettings,'resolutionX').name("TEST")

    @imageFolder.add @renderer.imageSettings,'resolutionY'
    @imageFolder.add @renderer.imageSettings,'antialiasMin'
    @imageFolder.add @renderer.imageSettings,'antialiasMax'
    @imageFolder.add @renderer.imageSettings,'samples'
    @imageFolder.add @renderer.imageSettings,'contrast'
    @imageFolder.add @renderer.imageSettings,'filter', THREE.SunflowRenderer.IMAGE_FILTERS
    @imageFolder.add @renderer.imageSettings,'jitter'

    @traceDepthsFolder = @gui.addFolder "Trace Depths"
    @traceDepthsFolder.add @renderer.traceDepthsSettings,'enabled'
    @traceDepthsFolder.add @renderer.traceDepthsSettings,'diffusion'
    @traceDepthsFolder.add @renderer.traceDepthsSettings,'reflection'
    @traceDepthsFolder.add @renderer.traceDepthsSettings,'refraction'

    @causticsFolder = @gui.addFolder "Caustics"
    @causticsFolder.add @renderer.causticsSettings,'enabled'
    @causticsFolder.add @renderer.causticsSettings,'photons'
    @causticsFolder.add @renderer.causticsSettings,'kdEstimate'
    @causticsFolder.add @renderer.causticsSettings,'kdRadius'

    @giFolder = @gui.addFolder "Global Illumination"
    @giFolder.add @renderer.giSettings,'enabled'
    @giFolder.add @renderer.giSettings,'type',THREE.SunflowRenderer.GI_TYPES
    @giFolder.add @renderer.giSettings,'samples'
    @giFolder.add @renderer.giSettings,'sets'

    null





