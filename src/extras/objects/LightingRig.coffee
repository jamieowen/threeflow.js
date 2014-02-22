
THREEFLOW.LightingRig = class LightingRig
  constructor:(params = {})->

    THREE.Object3D.call @

    params.backdropWall  = params.backdropWall || 300
    params.backdropFloor = params.backdropFloor  || 1000
    params.backdropCurve = params.backdropCurve || 50


    focus = new THREE.Vector3()

    geometry = @createBackdropGeometry params.backdropWall,params.backdropFloor,params.backdropCurve

    material = new THREE.MeshLambertMaterial
      color: 0xefefef
      ambient: 0x333333
      side: THREE.DoubleSide

    mesh = new THREE.Mesh geometry,material
    mesh.rotation.x = -(Math.PI/2)
    mesh.position.z = ( params.backdropFloor + params.backdropCurve )/2

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

  createBackdropGeometry:(wall,floor,curve)->
    points = []


    points.push new THREE.Vector3()
    points.push new THREE.Vector3(floor,0,0)

    points.push new THREE.Vector3(floor,0,wall)

    detail = .1
    #for angle in [0...Math.PI] by detail
    #  pts.push(new THREE.Vector3(Math.cos(angle) * radius,0,Math.sin(angle) * radius)) #angle/radius to x,z

    geometry = new THREE.LatheGeometry( points, 12, 0, Math.PI ) # create the lathe with 12 radial repetitions of the profile
    geometry















