
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

    @_keyRadiance = 5.5

    @lights = [
      new THREEFLOW.LightingRigLight @,true,
        name: "Key Light"
        keyRatio:0
        light:
          color: 0xffffef
          geometryType: "Plane"
          radiance: @keyRadiance

      new THREEFLOW.LightingRigLight @,false,
        name: "Fill Light"
        keyRatio:5
        light:
          color: 0xffffef
          geometryType: "Plane"

      new THREEFLOW.LightingRigLight @,false,
        # target the back wall
        name: "Back/Rim Light"
        keyRatio:2
        light:
          color: 0xffffef
          geometryType: "Plane"

      new THREEFLOW.LightingRigLight @,false,
        enabled: false
        name: "Background Light"
        keyRatio:8
        light:
          color: 0xffffef
          geometryType: "Plane"
    ]


    @transformControls = new THREE.TransformControls( @camera, @domElement )
    @transformControls.addEventListener "change", @onTransformChange
    @orbitControls = new THREE.OrbitControls( @camera, @domElement )

    @add @transformControls

    @projector  = new THREE.Projector();
    @raycaster  = new THREE.Raycaster();
    @pointerVec = new THREE.Vector3();

    #@domElement.addEventListener "mousedown", @onPointerDown, false
    #@domElement.addEventListener "mouseup", @onPointerUp, false
    #@domElement.addEventListener "mouseout", @onPointerUp, false
    @domElement.addEventListener "click", @onPointerClick, false

    window.addEventListener "keydown",@onKeyDown

    for light in @lights
      light.position.set(Math.random()*500, Math.random()*500, Math.random()*500)

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

    @transformControls.update()

  onPointerDown:(event)=>
    event.preventDefault()
    null

  onPointerUp:(event)=>
    event.preventDefault()
    null

  onPointerClick:(event)=>
    event.preventDefault()

    rect = @domElement.getBoundingClientRect()

    x = (event.clientX - rect.left) / rect.width
    y = (event.clientY - rect.top) / rect.height

    @pointerVec.set( ( x ) * 2 - 1, - ( y ) * 2 + 1, 0.5 )

    @projector.unprojectVector( @pointerVec, @camera );

    @raycaster.set( @camera.position, @pointerVec.sub( @camera.position ).normalize() );

    intersects = @raycaster.intersectObjects( @lights, true );

    if intersects.length
      intersect = intersects[0]
      if intersect.object.parent instanceof THREEFLOW.AreaLight
        rigLight = intersect.object.parent.parent
        @transformControls.attach rigLight
    else
      @transformControls.detach @transformControls.object

    null

  onKeyDown:(event)=>

    switch event.keyCode
      when 81 then @transformControls.setSpace( if @transformControls.space is "local" then "world" else "local" ) # Q
      when 87 then @transformControls.setMode("translate") # W
      when 69 then @transformControls.setMode("rotate") # E
      when 82 then @transformControls.setMode("scale") # R

    null

  update:()->
    if @lightsDirty
      console.log "Lights Dirty"
      @lightsDirty = false
      for light in @enabledLights
        @remove light

      @enabledLights.splice(0)

      for light in @lights
        if light.enabled
          @add light

          @enabledLights.push light

    if @keyRadianceDirty
      @keyRadianceDirty = false
      for light in @lights
        if light.keyRatio
          light.radiance = @keyRadiance / light.keyRatio

        if light.isKey
          light.light.radiance = @keyRadiance

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
















