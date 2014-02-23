
THREEFLOW.LightingRigGui = class LightingRigGui
  constructor:(@rig)->

    @gui = new dat.GUI()

    for light in @rig.lights
      @addRigLight light


  addRigLight:(rigLight)->
    folder = @gui.addFolder rigLight.name

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



    null



