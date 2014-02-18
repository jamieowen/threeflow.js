
THREEFLOW.LightingBox = class LightingBox
  constructor:(params = {})->

    THREE.Object3D.call @

    size      = params.size || 100
    segments  = params.segments || 2

    scaleX    = params.scaleX || 1
    scaleY    = params.scaleY || 1
    scaleZ    = params.scaleZ || 1

    materials = params.materials || null

    if not materials or materials.length < 6
      red = new THREEFLOW.DiffuseMaterial
        color:0xff0000
        side: THREE.DoubleSide

      green = new THREEFLOW.DiffuseMaterial
        color:0x00ff00
        side: THREE.DoubleSide

      blue = new THREEFLOW.DiffuseMaterial
        color:0x0000ff
        side: THREE.DoubleSide

      yellow = new THREEFLOW.DiffuseMaterial
        color: 0xffff00
        side: THREE.DoubleSide

      white = new THREEFLOW.DiffuseMaterial
        color: 0xffffff
        side: THREE.DoubleSide

      # up, down, left, right, forward, backward
      materials = [white,white,red,green,blue,yellow]

    geometry = new THREE.PlaneGeometry(size,size,segments,segments)

    up        = new THREE.Mesh geometry,materials[0]
    down      = new THREE.Mesh geometry,materials[1]
    left      = new THREE.Mesh geometry,materials[2]
    right     = new THREE.Mesh geometry,materials[3]
    forward   = new THREE.Mesh geometry,materials[4]
    backward  = new THREE.Mesh geometry,materials[5]

    size2 = size/2
    up.position.set(0,size,0)
    up.rotation.x = down.rotation.x = Math.PI/2
    down.position.set(0,0,0)

    left.position.set(-size2,size2,0)
    right.position.set(size2,size2,0)
    left.rotation.y = right.rotation.y = Math.PI/2

    forward.position.set 0,size2,size2
    backward.position.set 0,size2,-size2

    @add up
    @add down
    @add left
    @add right
    @add forward
    @add backward

    @scale.x = scaleX
    @scale.y = scaleY
    @scale.z = scaleZ

  @:: = Object.create THREE.Object3D::











