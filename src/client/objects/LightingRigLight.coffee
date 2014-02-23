
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

  # some test light geometry types.
  @LIGHT_GEOMETRY_TYPES = [
    "Plane"
    "Circle"
    "Box"
    "Sphere"
    "Ring"
  ]

  @DEFAULT_LIGHT_GEOMETRY_TYPE = "Circle"

  constructor:( @rig,params={} )->

    THREE.Object3D.call @

    @name = params.name || "RigLight"

    if typeof params.enabled is "boolean"
      @_enabled = params.enabled
    else
      @_enabled = true

    console.log "ENABLED,",@_enabled, @enabled
    # rotation, distance and target
    @target = params.target || new THREE.Vector3()

    @_pitchPhi = params.pitch || 0
    @_yawTheta = params.yaw || 0

    @_distance = params.distance || 500

    @rotateDirty = true

    @lightGeomPlane = null
    @lightGeomCircle = null
    @lightGeomBox = null
    @lightGeomSphere = null
    @lightGeomRing = null

    lightParams = params.light || {}

    if lightParams.geometryType
      @_geometryType = lightParams.geometryType
    else
      @_geometryType =  THREEFLOW.LightingRigLight.DEFAULT_LIGHT_GEOMETRY_TYPE

    lightParams.geometry = @getGeometry(@_geometryType)

    @light = new THREEFLOW.AreaLight lightParams
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

    geometryType:
      get: ->
        @_geometryType
      set: (value) ->
        if @_geometryType is value
          return

        geometry = @getGeometry(value)

        if geometry
          @light.geometry = geometry

    enabled:
      get: ->
        @_enabled
      set: (value) ->
        @_enabled = value
        if @rig
          @rig.lightsDirty = true

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


  getGeometry:(type)->

    geometry = null
    switch type
      when "Plane"
        geometry = @lightGeomPlane = new THREE.PlaneGeometry 400,400 if @lightGeomPlane is null
      when "Circle"
        geometry =  @lightGeomCircle = new THREE.CircleGeometry 200,12 if @lightGeomCircle is null
      when "Box"
        geometry = @lightGeomBox = new THREE.BoxGeometry 200,200,200 if @lightGeomBox is null
      when "Sphere"
        geometry = @lightGeomSphere = new THREE.SphereGeometry 200 if @lightGeomSphere is null
      when "Ring"
        geometry = @lightGeomRing = new THREE.RingGeometry 100,200,12,12 if @lightGeomRing is null

    geometry





