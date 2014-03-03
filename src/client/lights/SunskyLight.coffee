
THREEFLOW.SunskyLight = class SunskyLight
  constructor:( params )->

    THREE.Object3D.call @
    @_tf_noTraverse = true

    params = params || {}

    @up         = params.up || new THREE.Vector3 0,1,0
    @east       = params.east || new THREE.Vector3 0,0,1
    @direction  = params.direction || new THREE.Vector3 1,1,1

    @turbidity  = params.turbidity || 2
    @samples    = params.samples || 32

    # create the three.js objects that attempt to mimic the
    # sunsky light.

    params.simulate       = true if params.simulate isnt false
    params.dirLight       = true if params.dirLight isnt false
    params.hemLight       = true if params.hemLight isnt false

    if params.simulate
      # TODO: Match up with Sunsky as best as possible.
      if params.dirLight
        @dirLight = new THREE.DirectionalLight 0xffffff,1
        @add @dirLight

      if params.hemLight
        @hemLight  = new THREE.HemisphereLight 0xffffff,0x333333,.8
        @add @hemLight

  # Extend THREE.Object3D
  @:: = Object.create THREE.Object3D::