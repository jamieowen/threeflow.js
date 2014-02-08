
window.onload = ()->

  # initialise three js.
  webgl = new THREE.WebGLRenderer
    antialias:true
    canvas: document.getElementById "canvas"

  width       = webgl.domElement.width
  height      = webgl.domElement.height

  # define basics
  scene       = new THREE.Scene()
  camera      = new THREE.PerspectiveCamera(35,width/height,100,100000)
  controls    = new THREE.TrackballControls(camera,webgl.domElement)
  sunsky      = new THREEFLOW.SunskyLight
    dirLight: false
    hemLight: true

  plane       = new THREE.Mesh new THREEFLOW.InfinitePlaneGeometry(),new THREE.MeshLambertMaterial
    color:0xffffff
    wireframe:true

  #scene.add plane

  window.GEOM = plane.geometry

  # add to scene
  scene.add camera
  scene.add sunsky

  # position objects
  camera.position.set 0,0,-1000
  camera.lookAt new THREE.Vector3(0,0,0)

  # create cubes
  simplex = new SimplexNoise()
  simplexSmooth = .05
  size = 10
  gridX = 60
  gridZ = 40
  scale = 5
  offset = new THREE.Vector3 -(gridX*size)/2,0,-(gridZ*size)/2

  geometry = new THREE.CubeGeometry(size,size,size)
  material = new THREE.MeshLambertMaterial
    color: 0xffffff

  for ix in [0...gridX]
    for iz in [0...gridZ]
      cube = new THREE.Mesh geometry,material
      cubeScale = ((simplex.noise(ix*simplexSmooth,iz*simplexSmooth)+1)/2)*scale
      cube.scale.set 1,cubeScale,1
      cube.position.set ix*size,(cubeScale*size)/2,iz*size
      cube.position.add offset

      scene.add cube

  # create the sunflow renderer and connect.
  threeflow = new THREEFLOW.SunflowRenderer()
  threeflow.connect()

  # gui
  gui = new THREEFLOW.DatGui threeflow
  gui.onRender=()=>
    threeflow.render scene,camera,width,height

  gui.onPreview=()=>
    threeflow.render scene,camera,width,height

  # render
  render = ()->
    controls.update()
    webgl.render(scene,camera)
    requestAnimationFrame render
    null

  render()

  null






