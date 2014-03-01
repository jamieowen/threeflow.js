
THREEFLOW.LightingRig = class LightingRig
  constructor:(@camera,@domElement)->

    THREE.Object3D.call @

    # backdrop
    params = {}
    params.backdropWall       = params.backdropWall || 600
    params.backdropFloor      = params.backdropFloor  || 1500
    params.backdropCurve      = params.backdropCurve || 400
    params.backdropCurveSteps = params.backdropCurveSteps || 20
    params.backdropMaterial   = params.backdropMaterial || new THREEFLOW.DiffuseMaterial
      color: 0xefefef
      ambient: 0xffffff
      side: THREE.DoubleSide
      transparent: true
      opacity: 0.5

    @backdropMaterial = params.backdropMaterial

    @createBackdrop params.backdropWall,params.backdropFloor,params.backdropCurve,params.backdropCurveSteps,params.backdropMaterial

    # Only keep the one simulate light on the key light.
    # and add an ambient light
    @ambient = new THREE.HemisphereLight(0xefefff,0xa1efa1)
    @add @ambient

    @_keyRadiance = 5.5

    @lights = [
      new THREEFLOW.LightingRigLight @,true,
        name: "Key Light"
        light:
          color: 0xffffef
          geometryType: "Plane"
          radiance: @_keyRadiance

      new THREEFLOW.LightingRigLight @,false,
        enabled: false
        name: "Fill Light"
        light:
          color: 0xffffef
          geometryType: "Plane"
          simulate: false

      new THREEFLOW.LightingRigLight @,false,
        # target the back wall
        enabled: false
        name: "Back/Rim Light"
        light:
          color: 0xffffef
          geometryType: "Plane"
          simulate: false

      new THREEFLOW.LightingRigLight @,false,
        enabled: false
        name: "Background Light"
        light:
          color: 0xffffef
          geometryType: "Plane"
          simulate: false
    ]

    @projector  = new THREE.Projector();
    @raycaster  = new THREE.Raycaster();
    @pointerVec = new THREE.Vector3();

    @domElement.addEventListener "mousedown", @onPointerDown, false
    @domElement.addEventListener "mouseup", @onPointerUp, false
    #@domElement.addEventListener "mouseout", @onPointerUp, false
    window.addEventListener "keydown",@onKeyDown,false

    @transformControls = new THREE.TransformControls( @camera, @domElement )
    @transformControls.addEventListener "change", @onTransformChange
    @orbitControls = new THREE.OrbitControls( @camera, @domElement )

    # set _tf_noIndex here - ( it won't be indexed anyway but will display a warning otherwise )
    @transformControls._tf_noIndex = true

    @add @transformControls

    @enabledLights = []
    @lightsDirty = true
    @keyRadianceDirty = true

    @update()

  @:: = Object.create THREE.Object3D::

  Object.defineProperties @::,
    keyRadiance:
      get: ->
        @_keyRadiance
      set: (value) ->
        if @_keyRadiance is value
          return

        @_keyRadiance = value
        @keyRadianceDirty = true

  onTransformChange:(event)=>
    # disable orbit controls because of interaction conflicts
    if (event.state is "pointer-down" or event.state is "pointer-hover") and @orbitControls.enabled
      @orbitControls.enabled = false
    else if event.state is "pointer-up" and not @orbitControls.enabled
      @orbitControls.enabled = true

    for light in @enabledLights
      light.lookAtDirty = true

    @transformControls.update()


  onPointerDown:(event)=>
    event.preventDefault()
    ###
    intersect = @getIntersection()

    if intersect
      @orbitControls.enabled = false
    else
      @orbitControls.enabled = true
    ###
    null

  saveState:()->
    state = {}
    # scrapping keyRadiance / ratio for now.
    #state.keyRadiance = @keyRadiance

    state.lights = []

    for light in @lights
      l = {}
      l.enabled = light.enabled
      l.color = light.color
      #l.keyRatio = light.keyRatio
      l.radiance = light.radiance
      l.geometryType = light.geometryType

      l.target = {}
      l.target.x = light.targetMesh.position.x
      l.target.y = light.targetMesh.position.y
      l.target.z = light.targetMesh.position.z

      l.light = {}
      l.light.x = light.light.position.x
      l.light.y = light.light.position.y
      l.light.z = light.light.position.z
      l.light.sx = light.light.scale.x
      l.light.sy = light.light.scale.y
      l.light.sz = light.light.scale.z

      state.lights.push l

    state.camera = {}
    state.camera.x = @camera.position.x
    state.camera.y = @camera.position.y
    state.camera.z = @camera.position.z

    state.camera.rx = @camera.rotation.x
    state.camera.rx = @camera.rotation.y
    state.camera.rz = @camera.rotation.z
    state.camera.ord = @camera.rotation.order

    state.orbit = {}
    state.orbit.x = @orbitControls.target.x
    state.orbit.y = @orbitControls.target.y
    state.orbit.z = @orbitControls.target.z

    state

  loadState:(state)->
    if typeof state is "string"
      state = JSON.parse state

    @keyRadiance = state.keyRadiance

    for light,i in state.lights
      @lights[i].enabled = light.enabled
      @lights[i].color = light.color
      #@lights[i].keyRatio = light.keyRatio
      @lights[i].radiance = light.radiance
      @lights[i].geometryType = light.geometryType

      @lights[i].targetMesh.position.set light.target.x,light.target.y,light.target.z
      @lights[i].light.position.set light.light.x,light.light.y,light.light.z
      @lights[i].light.scale.set light.light.sx,light.light.sy,light.light.sz

      @lights[i].lookAtDirty = true

    if state.camera
      @camera.position.set state.camera.x,state.camera.y,state.camera.z
      @camera.rotation.set state.camera.rx,state.camera.ry,state.camera.rz,state.camera.ord

    if state.orbit
      @orbitControls.target.x = state.orbit.x
      @orbitControls.target.y = state.orbit.y
      @orbitControls.target.z = state.orbit.z

      @orbitControls.update()


    null

  onPointerUp:(event)=>
    event.preventDefault()

    intersect = @getIntersection()

    if intersect
      @orbitControls.enabled = false

      if intersect.object.parent instanceof THREEFLOW.AreaLight
        @transformControls.attach intersect.object.parent
      else if intersect.object.parent instanceof THREEFLOW.LightingRigLight
        @transformControls.attach intersect.object

      @transformControls.setMode("translate")
    else
      @transformControls.detach @transformControls.object
      #@orbitControls.enabled = true

    null

  getIntersection:()->

    rect = @domElement.getBoundingClientRect()

    x = (event.clientX - rect.left) / rect.width
    y = (event.clientY - rect.top) / rect.height

    @pointerVec.set( ( x ) * 2 - 1, - ( y ) * 2 + 1, 1 )
    @projector.unprojectVector( @pointerVec, @camera )

    @raycaster.set( @camera.position, @pointerVec.sub( @camera.position ).normalize() )

    objects = []
    for light in @enabledLights
      objects.push light.light.geometryMesh,light.targetMesh

    intersects = @raycaster.intersectObjects( objects, true )

    intersect = null
    if intersects.length
      intersect = intersects[0]

    intersect


  onKeyDown:(event)=>
    object = @transformControls.object
    if not object
      return

    if object instanceof THREEFLOW.AreaLight
      # allow translation and scaling of light
      switch event.keyCode
        when 81 then @transformControls.setSpace( if @transformControls.space is "local" then "world" else "local" ) # Q
        when 87 then @transformControls.setMode("translate") # W
        when 82 then @transformControls.setMode("scale") # R
    else if object.parent instanceof THREEFLOW.LightingRigLight
      # allow only translation of target
      switch event.keyCode
        when 81 then @transformControls.setSpace( if @transformControls.space is "local" then "world" else "local" ) # Q
        when 87 then @transformControls.setMode("translate") # W

    #when 69 then @transformControls.setMode("rotate") # E

    null

  update:()->
    if @lightsDirty
      @lightsDirty = false
      for light in @enabledLights
        if light.parent
          @remove light

      @enabledLights.splice(0)

      for light in @lights
        if light.enabled
          @add light
          @enabledLights.push light

    ###
    if @keyRadianceDirty
      @keyRadianceDirty = false
      for light in @lights
        if light.keyRatio
          light.radiance = @keyRadiance / light.keyRatio

        if light.isKey
          light.light.radiance = @keyRadiance

    ###

    @orbitControls.update()
    @transformControls.update()

    for light in @enabledLights
      light.update()

    #if not @orbitControls.enabled and not @pointerDown
    #  @orbitControls.enabled = true


  createBackdrop:(wall,floor,curve,curveSteps,material)->
    points = []

    points.push new THREE.Vector3()
    PI2 = Math.PI/2

    for angle in [Math.PI...Math.PI-PI2] by -(PI2/curveSteps)
      x = ( Math.sin(angle)*curve ) + floor
      z = ( Math.cos(angle)*curve ) + curve
      points.push new THREE.Vector3(x,0,z)

    points.push new THREE.Vector3(floor+curve,0,curve+wall)

    geometry = new THREE.LatheGeometry( points, 12, 0, Math.PI )

    mesh = new THREE.Mesh geometry,material
    mesh.rotation.x = -(Math.PI/2)
    mesh.position.z = floor/2

    @add mesh
    null