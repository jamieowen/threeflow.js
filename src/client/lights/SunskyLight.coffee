
THREE.SF.SunskyLight = class SunskyLight extends THREE.Object3D
  constructor:( params )->
    super()

    params = params || {}

    @up   = params.up || new THREE.Vector3 0,1,0
    @east = params.east || new THREE.Vector3 0,0,1
    @direction = params.direction || new THREE.Vector3 1,1,1

    @turbidity = params.turbidity || 6
    @samples = params.samples || 64

    # create the three.js objects that attempt to mimic the
    # sunsky light.

    @directionalLight = new THREE.DirectionalLight 0xffffff,1
    @hemisphereLight  = new THREE.HemisphereLight 0xffffff,0x333333,1

    @add @directionalLight
    @add @hemisphereLight

