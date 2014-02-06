
window.THREEFLOW = window.THREEFLOW || {}

THREEFLOW.DatGui = class DatGUI

  constructor:(@renderer)->
    if not window.dat and not window.dat.GUI
      throw new Error "No dat.GUI found."

    @gui = new dat.GUI()

    # user can add custom handlers by setting these properties.

    @onRender = null
    @onPreview = null

    # add render and preview buttons.
    @gui.add(@,"_onRender").name("Render Final")
    @gui.add(@,"_onPreview").name("Render Preview")

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

    @imageFolder        = @gui.addFolder "Image"
    @traceDepthsFolder  = @gui.addFolder "Trace Depths"
    @causticsFolder     = @gui.addFolder "Caustics"
    @giFolder           = @gui.addFolder "Global Illumination"
    @meshFolder         = @gui.addFolder "Mesh Options"

    @imageFolder.add @renderer.image,"antialiasMin"
    @imageFolder.add @renderer.image,"antialiasMax"
    @imageFolder.add @renderer.image,"samples"
    @imageFolder.add @renderer.image,"contrast"
    @imageFolder.add @renderer.image,"filter",@renderer.image.filterTypes
    @imageFolder.add @renderer.image,"jitter"

    @traceDepthsFolder.add @renderer.traceDepths,"enabled"
    @traceDepthsFolder.add @renderer.traceDepths,"diffusion"
    @traceDepthsFolder.add @renderer.traceDepths,"reflection"
    @traceDepthsFolder.add @renderer.traceDepths,"refraction"

    @causticsFolder.add @renderer.caustics,"enabled"
    @causticsFolder.add @renderer.caustics,"photons"
    @causticsFolder.add @renderer.caustics,"kdEstimate"
    @causticsFolder.add @renderer.caustics,"kdRadius"

    @meshFolder.add @renderer.meshes,"convertPrimitives"

    @giFolder.add @renderer.gi,"enabled"
    @giFolder.add @renderer.gi,"type",@renderer.gi.types

    @giTypes = [
      {type:@renderer.gi.types[0], name:"Instant GI", property:"igi"}
      {type:@renderer.gi.types[1], name:"Irradiance Caching / Final Gathering", property:"irrCache"}
      {type:@renderer.gi.types[2], name:"Path Tracing", property:"path"}
      {type:@renderer.gi.types[3], name:"Ambient Occlusion", property:"ambOcc"}
      {type:@renderer.gi.types[4], name:"Fake Ambient Term", property:"fake"}
    ]

    @giSubFolders = []

    for type in @giTypes
      giSubFolder = @giFolder.addFolder type.name
      @giSubFolders.push giSubFolder

      for property of @renderer.gi[type.property]
        if type.type is "irr-cache" and property is "globalMap"
          @giFolder.add @renderer.gi.irrCache,"globalMap",@renderer.gi.globalMapTypes
        else if type is "ambocc" and ( property is "bright" or property is "dark" )
          @giFolder.addColor @renderer.gi[type.property],property
        else if type.type is "fake"
          console.log "SKIPPED FAKE AMBIENT TERM GI(TODO)"
        else
          @giFolder.add @renderer.gi[type.property],property

    null

  _onRender:()=>
    if @onRender
      @onRender()

  _onPreview:()=>
    if @onPreview
      @onPreview()






