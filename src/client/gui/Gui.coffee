
THREEFLOW.Gui = class Gui

  constructor:(@renderer,@lightingRig)->
    if not window.dat and not window.dat.GUI
      throw new Error "No dat.GUI found."

    @gui = new dat.GUI()

    @onRender = new THREEFLOW.Signal()

    updateDisplay = ()=>
      for controller in @gui.__controllers
        controller.updateDisplay()

    statusObject =
      status: ''

    @renderer.onConnectionStatus.add (event)=>
      statusObject.status = event.status
      updateDisplay()

    @renderer.onRenderStatus.add (event)=>
      if event.status is THREEFLOW.SunflowRenderer.RENDER_PROGRESS
        statusObject.status = "rendering / " + event.progress + "%"
      else
        statusObject.status = event.status
      updateDisplay()

    @gui.add(THREEFLOW,"VERSION").name("THREEFLOW")
    @gui.add(statusObject, "status").name("Status")

    # add render and preview buttons.
    @gui.add(@,"_onRender").name("Render")
    @gui.add(@,"_onRenderIPR").name("Render IPR")

    @imageFolder        = @gui.addFolder "Image"
    @bucketFolder       = @gui.addFolder "Bucket Size/Order"
    @traceDepthsFolder  = @gui.addFolder "Trace Depths"
    @causticsFolder     = @gui.addFolder "Caustics"
    @giFolder           = @gui.addFolder "Global Illumination"

    if @lightingRig
      @lightingRigFolder = @gui.addFolder "Lighting Rig"
      @lightingRigFolder.add(@lightingRig,"saveState").name("Dump JSON").onChange ()=>
        state = @lightingRig.saveState()
        console.log JSON.stringify(state)


      for light in @lightingRig.lights
        @addRigLight @lightingRigFolder,light

      @backdropFolder = @lightingRigFolder.addFolder("Backdrop")
      @backdropFolder.add(@lightingRig.backdropMaterial,"wireframe")
      @backdropFolder.add(@lightingRig.backdropMaterial,"transparent")
      @backdropFolder.add(@lightingRig.backdropMaterial,"opacity",0,1)

    @overridesFolder    = @gui.addFolder "Overrides"
    @otherFolder        = @gui.addFolder "Other"

    # add scale in the image folder - although it is not sunflow related
    @imageFolder.add @renderer,"scale"

    @imageFolder.add @renderer.image,"antialiasMin"
    @imageFolder.add @renderer.image,"antialiasMax"
    @imageFolder.add @renderer.image,"samples"
    @imageFolder.add @renderer.image,"contrast"
    @imageFolder.add @renderer.image,"filter",@renderer.image.filterTypes
    @imageFolder.add @renderer.image,"jitter"

    @bucketFolder.add @renderer.bucket,"enabled"
    @bucketFolder.add @renderer.bucket,"size"
    @bucketFolder.add @renderer.bucket,"order",@renderer.bucket.orderTypes
    @bucketFolder.add @renderer.bucket,"reverse"

    @traceDepthsFolder.add @renderer.traceDepths,"enabled"
    @traceDepthsFolder.add @renderer.traceDepths,"diffusion"
    @traceDepthsFolder.add @renderer.traceDepths,"reflection"
    @traceDepthsFolder.add @renderer.traceDepths,"refraction"

    @causticsFolder.add @renderer.caustics,"enabled"
    @causticsFolder.add @renderer.caustics,"photons"
    @causticsFolder.add @renderer.caustics,"kdEstimate"
    @causticsFolder.add @renderer.caustics,"kdRadius"

    @overridesFolder.add(@renderer.lights.override.samples, "enabled" ).name("lightSamples")
    @overridesFolder.add(@renderer.lights.override.samples, "value" ).name("lightValue")

    @otherFolder.add @renderer.meshes,"convertPrimitives"
    @otherFolder.add(@renderer.geometry,"normals").name("geomNormals")
    @otherFolder.add(@renderer.bufferGeometry,"normals").name("bufferGeomNormals")

    @giFolder.add @renderer.gi,"enabled"

    # change the sub folder when the type changes.
    @giFolder.add(@renderer.gi,"type",@renderer.gi.types).onChange (value)=>
      updateType value

    @giTypes = [
      {type:@renderer.gi.types[0], name:"Instant GI", property:"igi"}
      {type:@renderer.gi.types[1], name:"Irradiance Caching / Final Gathering", property:"irrCache"}
      {type:@renderer.gi.types[2], name:"Path Tracing", property:"path"}
      {type:@renderer.gi.types[3], name:"Ambient Occlusion", property:"ambOcc"}
      {type:@renderer.gi.types[4], name:"Fake Ambient Term", property:"fake"}
    ]

    @giSubFolder = null

    updateFolder =(type)=>
      if not @giSubFolder
        @giSubFolder = @giFolder.addFolder(type.name)
      else
        controllers = @giSubFolder.__controllers.slice(0)
        for controller in controllers
          @giSubFolder.remove controller
        # hack here - this version of dat gui slices the array.. ( rather than splice )
        @giSubFolder.__controllers.splice(0)
        @giSubFolder.__ul.firstChild.innerHTML = type.name

      # gi sunflow type name
      giType = type.type

      # gi exporter property name for the type
      giTypeProperty = type.property

      # handle alternative property types
      for property of @renderer.gi[giTypeProperty]

        if giType is "irr-cache" and property is "globalMap"
          @giSubFolder.add @renderer.gi.irrCache,"globalMap",@renderer.gi.globalMapTypes

        else if giType is "ambocc" and ( property is "bright" or property is "dark" )
          @giSubFolder.addColor @renderer.gi.ambOcc,property

        else if giType is "fake" and property is "up"
          fake =
            upX: @renderer.gi.fake.up.x
            upY: @renderer.gi.fake.up.y
            upZ: @renderer.gi.fake.up.z

          @giSubFolder.add(fake,"upX").onChange (value)->
            @renderer.gi.fake.up.x = value
          @giSubFolder.add(fake,"upY").onChange (value)->
            @renderer.gi.fake.up.y = value
          @giSubFolder.add(fake,"upZ").onChange (value)->
            @renderer.gi.fake.up.z = value

        else if giType is "fake" and ( property is "sky" or property is "ground" )
          @giSubFolder.addColor @renderer.gi.fake,property
        else
          @giSubFolder.add @renderer.gi[giTypeProperty],property

      @giSubFolder.open()

      null

    updateType = (type)=>
      @renderer.gi.type = type
      updateFolder @giTypes[@renderer.gi.types.indexOf(type)]
      null

    updateType @renderer.gi.type

    null

  addRigLight:(gui,rigLight)->
    folder = gui.addFolder rigLight.name

    folder.add rigLight,"enabled"

    # convert to degrees.
    #rotate =
    #  yaw: rigLight.yaw*(180/Math.PI)
    #  pitch: rigLight.pitch*(180/Math.PI)

    # convert back to radians and set the light
    #folder.add( rotate,"yaw",0,360).onChange (value)->
    #  rotate.yaw = value
    #  rigLight.yaw = value*(Math.PI/180)

    #folder.add( rotate,"pitch",0,360).onChange (value)->
    #  rotate.pitch = value
    #  rigLight.pitch = value*(Math.PI/180)

    #folder.add rigLight,"distance",300,3000

    if rigLight.isKey
      folder.open()
      folder.add(rigLight,"radiance",0,200)
    else
      folder.add rigLight, "keyRatio",0,16
      folder.add(rigLight,"radiance",0,100).listen()

    folder.addColor(rigLight,"color").onChange (value)->
      hex = parseInt value, 16

    folder.add(rigLight,"geometryType",THREEFLOW.LightingRigLight.LIGHT_GEOMETRY_TYPES)

  _onRender:()=>
    @renderer.sunflowCl.ipr = false
    @onRender.dispatch()

  _onRenderIPR:()=>
    @renderer.sunflowCl.ipr = true
    @onRender.dispatch()






