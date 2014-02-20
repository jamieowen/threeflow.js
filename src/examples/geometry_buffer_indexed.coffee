
window.onload = ()->

  # initialise three js.
  webgl = new THREE.WebGLRenderer
    antialias:true
    canvas: document.getElementById "canvas"

  width       = webgl.domElement.width
  height      = webgl.domElement.height

  # define basics
  scene       = new THREE.Scene()
  camera      = new THREE.PerspectiveCamera(35,width/height,1,100000)
  controls    = new THREE.TrackballControls(camera,webgl.domElement)

  plane       = new THREE.Mesh new THREEFLOW.InfinitePlaneGeometry(),new THREE.MeshLambertMaterial
    color:0xffffff
    wireframe:true

  box = new THREEFLOW.LightingBox
    scaleY: 0.5
    size: 400

  scene.add box

  # add to scene
  scene.add camera
  scene.add plane

  triangles = 160000

  geometry = new THREE.BufferGeometry()

  geometry.addAttribute( 'index', Uint16Array, triangles * 3, 1 )
  geometry.addAttribute( 'position', Float32Array, triangles * 3, 3 )
  geometry.addAttribute( 'normal', Float32Array, triangles * 3, 3 )
  geometry.addAttribute( 'color', Float32Array, triangles * 3, 3 )

  # break geometry into
  # chunks of 21,845 triangles (3 unique vertices per triangle)
  # for indices to fit into 16 bit integer number
  # floor(2^16 / 3) = 21845

  chunkSize = 21845

  indices = geometry.attributes.index.array

  for i in [0...indices.length]
    indices[ i ] = i % ( 3 * chunkSize )

  positions = geometry.attributes.position.array
  normals = geometry.attributes.normal.array
  colors = geometry.attributes.color.array

  color = new THREE.Color()

  n = 40
  n2 = n/2 # triangles spread in the cube
  d = 5
  d2 = d/2 # individual triangle size

  pA = new THREE.Vector3()
  pB = new THREE.Vector3()
  pC = new THREE.Vector3()

  cb = new THREE.Vector3()
  ab = new THREE.Vector3()

  for i in [0...positions.length] by 9
    # positions
    x = Math.random() * n - n2
    y = Math.random() * n - n2
    z = Math.random() * n - n2

    ax = x + Math.random() * d - d2
    ay = y + Math.random() * d - d2
    az = z + Math.random() * d - d2

    bx = x + Math.random() * d - d2
    b_y = y + Math.random() * d - d2
    bz = z + Math.random() * d - d2

    cx = x + Math.random() * d - d2
    cy = y + Math.random() * d - d2
    cz = z + Math.random() * d - d2

    positions[ i ]     = ax
    positions[ i + 1 ] = ay
    positions[ i + 2 ] = az

    positions[ i + 3 ] = bx
    positions[ i + 4 ] = b_y
    positions[ i + 5 ] = bz

    positions[ i + 6 ] = cx
    positions[ i + 7 ] = cy
    positions[ i + 8 ] = cz

    # flat face normals

    pA.set( ax, ay, az )
    pB.set( bx, b_y, bz )
    pC.set( cx, cy, cz )

    cb.subVectors( pC, pB )
    ab.subVectors( pA, pB )
    cb.cross( ab )

    cb.normalize()

    nx = cb.x
    ny = cb.y
    nz = cb.z

    normals[ i ]     = nx
    normals[ i + 1 ] = ny
    normals[ i + 2 ] = nz

    normals[ i + 3 ] = nx
    normals[ i + 4 ] = ny
    normals[ i + 5 ] = nz

    normals[ i + 6 ] = nx
    normals[ i + 7 ] = ny
    normals[ i + 8 ] = nz

    # colors

    vx = ( x / n ) + 0.5
    vy = ( y / n ) + 0.5
    vz = ( z / n ) + 0.5

    color.setRGB( vx, vy, vz )

    colors[ i ]     = color.r
    colors[ i + 1 ] = color.g
    colors[ i + 2 ] = color.b

    colors[ i + 3 ] = color.r
    colors[ i + 4 ] = color.g
    colors[ i + 5 ] = color.b

    colors[ i + 6 ] = color.r
    colors[ i + 7 ] = color.g
    colors[ i + 8 ] = color.b

  geometry.offsets = []

  offsets = triangles / chunkSize

  for i in [0...offsets]
    offset =
      start: i * chunkSize * 3
      index: i * chunkSize * 3
      count: Math.min( triangles - ( i * chunkSize ), chunkSize ) * 3

    geometry.offsets.push offset

  geometry.computeBoundingSphere()

  material = new THREE.MeshPhongMaterial
    color: 0xaaaaaa
    ambient: 0xaaaaaa
    specular: 0xffffff
    shininess: 250
    side: THREE.DoubleSide
    vertexColors: THREE.VertexColors

  object = new THREE.Mesh( geometry, material )
  scene.add( object )

  # position objects
  camera.position.set 70,50,80
  object.position.y = n
  controls.target = object.position

  # lights

  # add simulate lights = false
  # otherwise it is overkill for preview.

  # Instead add basic light ( won't be renderered by sunflow )

  hemLight = new THREE.HemisphereLight()
  scene.add hemLight

  lightGeom = new THREE.PlaneGeometry 30,30
  redLight = new THREEFLOW.AreaLight
    color: 0xff9999
    radiance: 20
    intensity: 3
    simulate:false
    geometry: lightGeom

  redLight.position.set 60,70,-50
  redLight.lookAt object.position
  scene.add redLight

  greenLight = new THREEFLOW.AreaLight
    color: 0x99ff99
    radiance: 14
    intensity: 3
    simulate:false
    geometry: lightGeom

  greenLight.position.set -80,50,50
  greenLight.lookAt object.position
  scene.add greenLight

  whiteLight = new THREEFLOW.AreaLight
    color: 0xffffff
    radiance: 10
    intensity: 3
    simulate:false
    geometry: lightGeom

  whiteLight.position.set 0,20,90
  whiteLight.lookAt object.position
  scene.add whiteLight

  # create the sunflow renderer and connect.
  threeflow = new THREEFLOW.SunflowRenderer
    pngPath:"examples/renders/geometry_buffer_indexed.png"
    scPath:"examples/renders/geometry_buffer_indexed.sc"


  threeflow.connect()

  threeflow.image.antialiasMin = -1
  threeflow.image.antialiasMax = 0

  # gui
  gui = new THREEFLOW.DatGui threeflow
  gui.onRender=()=>
    threeflow.render scene,camera,width,height

  # render
  render = ()->
    controls.update()
    webgl.render(scene,camera)
    requestAnimationFrame render
    null

  render()

  null






