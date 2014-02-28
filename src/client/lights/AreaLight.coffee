###

params :
  # both
  color: 0xffffff

  # three.js ( AreaLight )
  intensity: 1
  width: 1
  height: 1

  # threeflow / sunflow
  radiance: 100.0
  samples: 16
  geometry: THREE.PlaneGeometry ( or any other geometry object )
  simulate: true
  markers: true

###
THREEFLOW.AreaLight = class AreaLight

  constructor:( params = {} )->

    THREE.Object3D.call @

    @_tf_noTraverse = true

    @_color       = new THREE.Color params.color
    @_radiance    = params.radiance || 100.0
    @samples      = params.samples || 16

    @markerMaterial = new THREE.MeshBasicMaterial
      wireframe: true
      side: THREE.DoubleSide
      color: @_color

    # line drawn to target - will be updated when target is set. ( via geometry first )
    @lineGeometry = new THREE.Geometry()
    @lineGeometry.vertices.push new THREE.Vector3()
    @lineGeometry.vertices.push new THREE.Vector3(0,0,100)
    @lineMesh = new THREE.Line @lineGeometry, new THREE.LineBasicMaterial
      color: @_color.getHex()
    @lineMesh.name = "LINE MESH"
    @lineMesh.matrixAutoUpdate = false
    @add @lineMesh

    @toIntensity      = 1
    @planar           = true
    @planarDirection  = new THREE.Vector3()
    @geometryMesh     = null
    @geometry         = params.geometry || new THREE.PlaneGeometry 100,100
    @simulate         = true if params.simulate isnt false


  # Extend THREE.Object3D
  @:: = Object.create THREE.Object3D::

  # getters / setters
  Object.defineProperties @::,
    color:
      get: ->
        @_color
      set: (value) ->
        @_color = value

        if @light
          @light.color.setRGB @_color

        @markerMaterial.color = @_color

    radiance:
      get: ->
        @_radiance
      set: (value) ->
        if @_radiance is value
          return

        @_radiance = value

        #if @light
        #  #@light.intensity = @_radiance * @toIntensity
        #  console.log "set intensity :", @light.intensity

    simulate:
      get: ->
        @_simulate
      set: (value) ->
        if @_simulate is value
          return

        @_simulate = value

        @updateLight()

    geometry:
      get: ->
        @_geometry
      set: (value) ->
        if @_geometry is value or not value
          return

        @_geometry = value

        # Need to checked a bettwer way to do this, update vertices?
        if @geometryMesh
          @remove @geometryMesh


        # calculate lighting.
        if not @_geometry.boundingBox
          @_geometry.computeBoundingBox()

        bb = @_geometry.boundingBox.size()

        # volume/area
        va = 0
        @planar = true

        if bb.x is 0
          va = bb.y * bb.z
          @planarDirection.set(1,0,0)
        else if bb.y is 0
          va = bb.x * bb.z
          @planarDirection.set(0,1,0)
        else if bb.z is 0
          va = bb.x * bb.y
          @planarDirection.set(0,0,1)
        else
          va = bb.x * bb.y * bb.z
          @planar = false

        if @planar
          # ( 100*100 ) / 10000 = 1
          @toIntensity = ( va * 0.00001 )
        else
          # ( 100*100*100 ) / 1000000 = 1
          @toIntensity = va / 1000000

        @updateLight()

        @geometryMesh = new THREE.Mesh @_geometry,@markerMaterial
        @add @geometryMesh

        @geometryMesh.name = "GEOMETRY MESH"

  updateLight:()->
    if not @_simulate and @light
      @remove @light
      return
    else if not @_simulate
      return
    else if @_simulate and not @light
    # create light for first first time
      if @planar
        # add directional light
        @light = new THREE.DirectionalLight @_color,1
        @light.position.set 0,0,0
        @light.target.position.copy @planarDirection
      else
        # add point light
        @light = new THREE.PointLight @_color,1

      @add @light

    else if @planar and @light instanceof THREE.PointLight
    # ( check we have the right light type - geometry change? )
      @remove @light
      # swap to directional light
      @light = new THREE.DirectionalLight @_color,1
      @light.position.set 0,0,0
      @light.target.position.copy @planarDirection
      console.log "SWAP TO", @light
      @add @light
    else if not @planar and @light instanceof THREE.DirectionalLight
      # swap to point light
      @remove @light
      @light = new THREE.PointLight @_color,1
      @add @light

    # set intensity
    #@light.intensity = 1 # @_radiance * @toIntensity
