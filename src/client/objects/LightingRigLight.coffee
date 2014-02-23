
###
# parameter options.
rig = new THREEFLOW.LightingRigLight
  target: target.position
  rotateX: 90
  rotateY: 0
  rotateZ: 0
  distance: 400
  color: 0xff0000 # shorthand for light color
  light: new THREEFLOW.AreaLight
    color: 0xffffff
    geometry: new THREE.SphereGeometry()
  bounce:
    rotateX:-90
    distance: 50
    color: 0xffffff # another shorthand for material color
    material: new THREEFLOW.ShinyMaterial
      color: 0xff0000
    geometry: new THREE.PlaneGeometry()
###

THREEFLOW.LightingRigLight = class LightingRigLight

  constructor:( params={} )->

    THREE.Object3D.call @

    @name = params.name || "RigLight"

    # rotation, distance and target
    @target = params.target || new THREE.Vector3()

    @_pitchPhi = params.pitch || 0
    @_yawTheta = params.yaw || 0

    @_distance = params.distance || 500

    @rotateDirty = true

    @light = params.light || new THREEFLOW.AreaLight
      color: params.color
      geometry: new THREE.PlaneGeometry 200,200

    @add @light

    params.bounce = params.bounce || null
    params.bounce = {} if typeof(params.bounce) is "boolean"

    if params.bounce

      @bouncePitchPhi = params.bounce.pitch || 0
      @bounceYawTheta = params.bounce.yaw || 0

      material = params.bounce.material || new THREEFLOW.DiffuseMaterial
        color: params.bounce.color

      geometry = params.bounce.geometry || new THREE.PlaneGeometry()

      @bounce = new THREE.Mesh geometry,material
      @add @bounce

      @bounceDirty = true

    @update()

  @:: = Object.create THREE.Object3D::

  # getters / setters
  Object.defineProperties @::,
    yaw:
      get: ->
        @_yawTheta
      set: (value) ->
        if @_yawTheta is value
          return

        @_yawTheta = value
        @rotateDirty = true
    pitch:
      get: ->
        @_pitchPhi
      set: (value) ->
        if @_pitchPhi is value
          return

        @_pitchPhi = value
        @rotateDirty = true
    distance:
      get: ->
        @_distance
      set: (value) ->
        if @_distance is value
          return

        @_distance = value
        @rotateDirty = true
    color:
      get: ->
        @light.color.getHex()
      set: (value) ->
        @light.color.setHex(value)

    radiance:
      get: ->
        @light.radiance
      set: (value) ->
        @light.radiance = value

  update:()->
    if @rotateDirty
      @rotateDirty = false

      console.log "update light"

      @light.position.x = @_distance * Math.sin(@_pitchPhi) * Math.cos(@_yawTheta)
      @light.position.y = @_distance * Math.cos(@_pitchPhi)
      @light.position.z = @_distance * Math.sin(@_pitchPhi) * Math.sin(@_yawTheta)

      @light.lookAt @target

      @bounceDirty = true

    if @bounceDirty
      @bounceDirty = false

    null




