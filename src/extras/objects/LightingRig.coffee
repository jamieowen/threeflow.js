
THREEFLOW.LightingRig = class LightingRig
  constructor:(params = {})->

    THREE.Object3D.call @

    params.backdropWall       = params.backdropWall || 600
    params.backdropFloor      = params.backdropFloor  || 1500
    params.backdropCurve      = params.backdropCurve || 400
    params.backdropCurveSteps = params.backdropCurveSteps || 20

    focus = new THREE.Vector3()

    geometry = @createBackdropGeometry params.backdropWall,params.backdropFloor,params.backdropCurve,params.backdropCurveSteps

    material = new THREE.MeshLambertMaterial
      color: 0xefefef
      ambient: 0xffffff
      side: THREE.DoubleSide

    mesh = new THREE.Mesh geometry,material
    mesh.rotation.x = -(Math.PI/2)
    mesh.position.z = (params.backdropFloor)/2

    @add mesh

    light1 = new THREEFLOW.AreaLight
      radiance: 5
      geometry: new THREE.PlaneGeometry 200,200

    light1.position.set -200,200,200
    light1.lookAt focus

    light2 = new THREEFLOW.AreaLight
      radiance: 5
      geometry: new THREE.PlaneGeometry 200,200

    light2.position.set 200,400,200
    light2.lookAt focus

    @add light1
    @add light2

  @:: = Object.create THREE.Object3D::

  createBackdropGeometry:(wall,floor,curve,curveSteps)->
    points = []

    points.push new THREE.Vector3()
    PI2 = Math.PI/2

    for angle in [Math.PI...Math.PI-PI2] by -(PI2/curveSteps)
      x = ( Math.sin(angle)*curve ) + floor
      z = ( Math.cos(angle)*curve ) + curve
      points.push new THREE.Vector3(x,0,z)

    points.push new THREE.Vector3(floor+curve,0,curve+wall)

    geometry = new THREE.LatheGeometry( points, 12, 0, Math.PI )
    geometry















