
class DiffuseObjectsSetup
  constructor:()->
    @inited = false

  init:()->
    if @inited
      return

    @inited = true

    @sphereGeometry = new THREE.SphereGeometry(98)
    @sphereCenterGeometry = new THREE.SphereGeometry(250)

    @colors = [0x52ADCC,0xADD982,0xE6F2C2,0xF1E56C,0xF37A61,0x52ADCC,0xADD982,0xE6F2C2]

    @materialParams = []
    for color in @colors
      @materialParams.push
        color: color
        wireframe: true

    @meshes = []
    @materials = []

    spacing = (Math.PI*2)/@materialParams.length
    radius  = 350

    # outer circle of spheres
    for params,i in @materialParams
      material = new THREE.SF.DiffuseMaterial params
      mesh = new THREE.Mesh @sphereGeometry,material

      mesh.position.x = Math.cos( spacing*i ) * radius
      mesh.position.z = Math.sin( spacing*i ) * radius
      mesh.position.y = @sphereGeometry.radius

      @meshes.push mesh
      @materials.push material

    # center mirror sphere
    material = new THREE.SF.MirrorMaterial
      color: 0xFEFEFE
      reflection: 0xefefff
      wireframe: true

    center = new THREE.Mesh(@sphereCenterGeometry,material)
    center.position.set 0,@sphereCenterGeometry.radius,0
    @meshes.push center


    # floor plane ( may move this out )
    material = new THREE.SF.ShinyMaterial
      color: 0xafafaf
      reflection: 1
      wireframe: true

    floor = new THREE.Mesh new THREE.PlaneGeometry(10000,10000,100,100),material
    floor.rotation.x = -(Math.PI/2)
    @meshes.push floor

    null


  add:(scene)->
    @init()

    for mesh in @meshes
      scene.add mesh

    null

  remove:(scene)->

    for mesh in @meshes
      scene.remove mesh

    null

  update:()->
    null
