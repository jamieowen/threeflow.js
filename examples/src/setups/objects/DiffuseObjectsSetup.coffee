
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
      mesh.position.y = 50

      @meshes.push mesh
      @materials.push material

    # center mirror sphere
    material = new THREE.SF.MirrorMaterial
      color: 0xFEFEFE
      reflection: 0xefefff
      wireframe: true

    center = new THREE.Mesh(@sphereCenterGeometry,material)
    center.position.set 0,250,0

    @meshes.push center

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
