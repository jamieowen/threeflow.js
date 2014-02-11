###

params :
  # both
  color: 0xffffff

  # three.js ( PointLight )
  intensity: 1
  distance: 0

  # threeflow / sunflow
  power: 100.0
  simulate: true
  markers: true
  markerSize: 1

###
THREEFLOW.PointLight = class PointLight

  constructor:( params = {} )->

    THREE.Object3D.call @

    @simulate     = true if params.simulate isnt false
    @markers      = true if params.markers isnt false

    @_color       = new THREE.Color params.color
    @_power       = params.power || 100.0

    # replace the marker/light color object with this internal one.
    if @markers
      markerSize    = params.markerSize || 1

      geometry = new THREE.SphereGeometry markerSize,3,3
      material = new THREE.MeshBasicMaterial
        wireframe: true
      material.color = @_color

      @mesh = new THREE.Mesh geometry,material
      @add @mesh

    if @simulate
      @light = new THREE.PointLight params.color,params.intensity,params.distance
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
    power:
      get: ->
        @_power
      set: (value) ->
        # TODO : Set the PointLight intensity when simulating?
        @_power = value