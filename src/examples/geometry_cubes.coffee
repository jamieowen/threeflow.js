
window.onload = ()->

  # initialise three js.
  webgl = new THREE.WebGLRenderer
    antialias:true
    canvas: document.getElementById "canvas"

  width       = webgl.domElement.width
  height      = webgl.domElement.height

  # define scene/objects
  scene       = new THREE.Scene()

  camera      = new THREE.PerspectiveCamera(35,width/height,100,100000)
  controls    = new THREE.TrackballControls(camera,webgl.domElement)
  sphere      = new THREE.Mesh( new THREE.SphereGeometry(),new THREE.MeshLambertMaterial(0xff0000))
  sunsky      = new THREEFLOW.SunskyLight()

  # add to scene
  scene.add camera
  scene.add sunsky
  scene.add sphere

  # position objects
  camera.position.set 0,0,-1000
  camera.lookAt new THREE.Vector3(0,0,0)

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






