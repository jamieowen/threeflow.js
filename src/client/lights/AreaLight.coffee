###

# A Sunflow MeshLight with plane geometry..

params :
  color: 0xffffff
  # three.js
  intensity: 1
  distance: 0

  # threeflow / sunflow
  power: 100.0
  simulate: true
  markers: true

###
THREEFLOW.AreaLight = class AreaLight

  constructor:( params = {} )->

    THREE.Object3D.call @

    params.simulate   = true if params.simulate isnt false
    params.markers    = true if params.markers isnt false

    params.color      = 0xffffff if isNaN params.color

    @radiance   = params.radiance || 100.0

    params.samples    = params.samples ||

    params.width      = params.width || 10
    params.height     = params.height || 10

    @_color = params.color
    @_power = params.power

    @simulate = params.simulate

    if @simulate
      @light = new THREE.PointLight(@_color,params.intensity,params.distance)
      @add @light
    else
      @_color = new THREE.Color(@_color)

    @markers = params.markers

    if @markers
      geometry = new THREE.PlaneGeometry params.markerSize,3,3
      material = new THREE.MeshBasicMaterial
        color: @_color
        wireframe: true

      @mesh = new THREE.Mesh geometry,material
      @add @mesh

  # Extend THREE.Object3D
  @:: = Object.create THREE.Object3D::

  # getters / setters
  Object.defineProperties @::,
    color:
      get: ->
        if @simulate
          @light.color
        else
          @_color
      set: (value) ->
        @_color = value

        if @simulate
          @light.color.set @_color

        if @markers
          @mesh.material.color.set @_color

    power:
      get: ->
        @_power
      set: (value) ->
        # TODO : Set the PointLight intensity when simulating?
        @_power = value