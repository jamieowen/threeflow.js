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

    @_geometry = params.geometry || new THREE.PlaneGeometry 10,10

    if @markers
      @material = new THREE.MeshBasicMaterial
        wireframe: true
      @material.color = @_color

      @mesh = new THREE.Mesh @_geometry,@material
      @add @mesh

      # line for direction
      lineGeometry = new THREE.Geometry()
      lineGeometry.vertices.push new THREE.Vector3( 0, 0, 0 )
      lineGeometry.vertices.push new THREE.Vector3( 0, 0, 100 )

      @line = new THREE.Line lineGeometry, new THREE.LineBasicMaterial
        color: @_color.getHex()

      #@line.matrixAutoUpdate = false
      @add @line

    if @simulate
      # Just use three.js point light for now.
      @light = new THREE.PointLight params.color,params.intensity
      @light.color = @_color
      @add @light

  # Extend THREE.Object3D
  @:: = Object.create THREE.Object3D::

  # getters / setters
  Object.defineProperties @::,
    color:
      get: ->
        @_color
      set: (value) ->
        @_color = value

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
        if @_geometry is value
          return

        @_geometry = value

        # TODO : need to see if update can be made without creating new mesh
        @remove @mesh
        @mesh = new THREE.Mesh @_geometry,@material
        @add @mesh