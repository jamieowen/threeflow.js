
THREEFLOW.LightingRigGui = class LightingRigGui
  constructor:(@rig)->

    @gui = new dat.GUI()

    @gui.addFolder "lighting"
