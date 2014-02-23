
THREEFLOW.LightingRigGui = class LightingRigGui
  constructor:(@rig)->

    @gui = new dat.GUI()

    @backdropFolder = @gui.addFolder("Backdrop")
    @backdropFolder.add(@rig.backdropMaterial,"wireframe")
    @backdropFolder.add(@rig.backdropMaterial,"transparent")
    @backdropFolder.add(@rig.backdropMaterial,"opacity",0,1)

    @backdropFolder.open()

    for light in @rig.lights
      @addRigLight light

  addRigLight:(rigLight)->
    folder = @gui.addFolder rigLight.name

    folder.add rigLight,"enabled"

    # convert to degrees.
    rotate =
      yaw: rigLight.yaw*(180/Math.PI)
      pitch: rigLight.pitch*(180/Math.PI)

    # convert back to radians and set the light
    folder.add( rotate,"yaw",0,360).onChange (value)->
      rotate.yaw = value
      rigLight.yaw = value*(Math.PI/180)

    folder.add( rotate,"pitch",0,360).onChange (value)->
      rotate.pitch = value
      rigLight.pitch = value*(Math.PI/180)

    folder.add rigLight,"distance",300,2000

    folder.addColor(rigLight,"color").onChange (value)->
      hex = parseInt value, 16
      console.log hex

    folder.add rigLight,"radiance",0,100

    folder.add rigLight,"geometryType",THREEFLOW.LightingRigLight.LIGHT_GEOMETRY_TYPES



    null



