
THREEFLOW.LightingRig = class LightingRig
  constructor:(params = {})->

    THREE.Object3D.call @

    # target
    @target                   = params.target || new THREE.Vector3()

    # backdrop
    params.backdropWall       = params.backdropWall || 600
    params.backdropFloor      = params.backdropFloor  || 1500
    params.backdropCurve      = params.backdropCurve || 400
    params.backdropCurveSteps = params.backdropCurveSteps || 20
    params.backdropMaterial   = params.backdropMaterial || new THREEFLOW.DiffuseMaterial
      color: 0xefefef
      ambient: 0xffffff
      side: THREE.DoubleSide

    @createBackdrop params.backdropWall,params.backdropFloor,params.backdropCurve,params.backdropCurveSteps,params.backdropMaterial

    geometry = new THREE.PlaneGeometry 400,400

    keyRadiance = 5.5

    baseYaw = Math.PI/2
    basePitch = Math.PI/2

    toRADIANS = Math.PI/180

    # lights
    @lights = params.lights || [
      # key light
      new THREEFLOW.LightingRigLight
        name: "Key Light"
        target: @target
        pitch: basePitch - ( 30*toRADIANS )
        yaw: baseYaw + ( 45*toRADIANS )
        distance: 700
        light: new THREEFLOW.AreaLight
          color: 0xffffef
          geometry: geometry
          intensity: .5
          radiance: keyRadiance

      # fill light

      new THREEFLOW.LightingRigLight
        name: "Fill Light"
        target: @target
        pitch: basePitch - ( 16*toRADIANS )
        yaw: baseYaw - ( 60*toRADIANS )
        distance: 700
        light: new THREEFLOW.AreaLight
          color: 0xffffef
          geometry: geometry
          intensity: .5
          radiance: keyRadiance / 5

      # back light
      new THREEFLOW.LightingRigLight
        # target the back wall
        name: "Back/Rim Light"
        target: new THREE.Vector3(0,0,-((params.backdropFloor/2)+params.backdropCurve))
        pitch: basePitch - ( 20*toRADIANS )
        yaw: baseYaw + ( 135*toRADIANS )
        distance: 900
        light: new THREEFLOW.AreaLight
          color: 0xffffef
          geometry: geometry
          intensity: .5
          radiance: keyRadiance / 2


      # background light
      new THREEFLOW.LightingRigLight
        # target the back wall
        name: "Background Light"
        target: new THREE.Vector3(0,0,-((params.backdropFloor/2)+params.backdropCurve))
        pitch: basePitch - ( 20*toRADIANS )
        yaw: baseYaw - ( 120*toRADIANS )
        distance: 900
        light: new THREEFLOW.AreaLight
          color: 0xffffef
          geometry: geometry
          intensity: .5
          radiance: keyRadiance / 4
    ]

    for light in @lights
      @add light

    @update()

  @:: = Object.create THREE.Object3D::

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

  update:()->
    for light in @lights
      light.update()
















