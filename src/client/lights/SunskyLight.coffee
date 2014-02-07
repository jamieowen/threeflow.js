
THREEFLOW.SunskyLight = class SunskyLight extends THREE.Object3D
  constructor:( params )->
    super()

    params = params || {}

    @up   = params.up || new THREE.Vector3 0,1,0
    @east = params.east || new THREE.Vector3 0,0,1
    @direction = params.direction || new THREE.Vector3 1,1,1

    @turbidity = params.turbidity || 2
    @samples = params.samples || 32

    # create the three.js objects that attempt to mimic the
    # sunsky light.

    params.previewLights      = true if params.previewLights isnt false
    params.directionalLight   = true if params.directionalLight isnt false
    params.hemisphereLight    = true if params.hemisphereLight isnt false

    if params.previewLights
      # TODO: Match up with Sunsky as best as possible.
      if params.directionalLight
        @directionalLight = new THREE.DirectionalLight 0xffffff,1
        @directionalLight.position.set 10,50,0
        @add @directionalLight

      if params.hemisphereLight
        @hemisphereLight  = new THREE.HemisphereLight 0xffffff,0x000000,.8
        @add @hemisphereLight