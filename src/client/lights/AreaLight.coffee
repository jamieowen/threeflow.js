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

    @simulate     = true if params.simulate isnt false
    @markers      = true if params.markers isnt false

    @_color       = new THREE.Color params.color
    @_radiance    = params.radiance || 100.0
    @samples      = params.samples || 16

    @target       = new THREE.Vector3()
    # geometry setter, creates lights/markers
    @geometry     = params.geometry || new THREE.PlaneGeometry 100,100

  # Extend THREE.Object3D
  @:: = Object.create THREE.Object3D::

  # getters / setters
  Object.defineProperties @::,
    color:
      get: ->
        @_color
      set: (value) ->
        @_color = value

        if @simulate
          @light.color.setRGB @_color

        if @markers
          @material.color = @_color

    radiance:
      get: ->
        @_radiance
      set: (value) ->
        if @_radiance is value
          return

        # TODO : Set the three.js PointLight intensity when simulating?

        @_radiance = value

    geometry:
      get: ->
        @_geometry
      set: (value) ->
        if @_geometry is value or not value
          return

        @_geometry = value

        # Need to checked a bettwer way to do this, update vertices?
        if @mesh
          @remove @mesh

        if @simulate or @markers
          # calculate lighting.
          if not @_geometry.boundingBox
            @_geometry.computeBoundingBox()

          bb = @_geometry.boundingBox.size()

          # volume/area
          va = 0
          dir = new THREE.Vector3()
          planar = true

          if bb.x is 0
            va = bb.y * bb.z
            dir.set(1,0,0)
          else if bb.y is 0
            va = bb.x * bb.z
            dir.set(0,1,0)
          else if bb.z is 0
            va = bb.x * bb.y
            dir.set(0,0,1)
          else
            va = bb.x * bb.y * bb.z
            planar = false

        if @simulate
          if planar
            # add directional light
            @light = new THREE.DirectionalLight @_color,1
            #@light.target.copy dir
            @light.color = @_color
            @add @light
          else
            # add point light
            @light = new THREE.PointLight @_color,1
            #@light.target.copy dir
            @light.color = @_color
            @add @light

        if @markers
          @material = new THREE.MeshBasicMaterial
            wireframe: true
            side: THREE.DoubleSide

          @material.color = @_color

          # line for direction
          lineGeometry = new THREE.Geometry()
          lineGeometry.vertices.push new THREE.Vector3( 0, 0, 0 )
          lineGeometry.vertices.push dir.clone().multiplyScalar(100)

          @line = new THREE.Line lineGeometry, new THREE.LineBasicMaterial
            color: @_color.getHex()

          @line.matrixAutoUpdate = false
          @add @line

          @mesh = new THREE.Mesh @_geometry,@material
          @add @mesh