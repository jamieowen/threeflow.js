
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

  # add to scene
  scene.add camera
  scene.add plane

  # position objects
  camera.position.set 50,20,50
  camera.lookAt new THREE.Vector3(0,0,0)

  geometry = new THREE.IcosahedronGeometry 5,1
  material = new THREEFLOW.DiffuseMaterial
    color: 0x0000ff
    shading:THREE.FlatShading
    wireframe:true

  cube = new THREE.Mesh geometry,material
  cube.position.set 0,geometry.radius,0
  scene.add cube

  redLight = new THREEFLOW.AreaLight
    color: 0xff9999
    radiance: 100
    intensity: 3

  redLight.position.set 15,20,-15
  redLight.lookAt cube.position
  #scene.add redLight

  greenLight = new THREEFLOW.AreaLight
    color: 0x99ff99
    radiance: 100
    intensity: 3

  greenLight.position.set -15,20,15
  greenLight.lookAt cube.position
  #scene.add greenLight

  whiteLight = new THREEFLOW.AreaLight
    color: 0xffffff
    radiance: 10
    intensity: 3
    #simulate: false

  whiteLight.position.set 0,15,0
  whiteLight.lookAt cube.position
  scene.add whiteLight

  # create the sunflow renderer and connect.
  threeflow = new THREEFLOW.SunflowRenderer
    pngPath:"examples/renders/lights_area.png"
    scPath:"examples/renders/lights_area.sc"

  threeflow.connect()

  threeflow.image.samples = 4
  #threeflow.image.filter = "mitchell"
  threeflow.gi.enabled = true
  threeflow.gi.type = "path"
  threeflow.traceDepths.enabled = true
  threeflow.traceDepths.diffusion = 2

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






