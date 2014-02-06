
window.onload = ()->

  # create the sunflow renderer and connect.
  threeflow = new THREE.SunflowRenderer()
  threeflow.connect()

  gui = new THREEFLOW.DatGui threeflow

  webgl = new THREE.WebGLRenderer
    antialias:true
    canvas: document.getElementById "canvas"

  width       = webgl.domElement.width
  height      = webgl.domElement.height

  # define
  scene       = new THREE.Scene()

  camera      = new THREE.PerspectiveCamera(35,width/height,100,100000)
  controls    = new THREE.TrackballControls(camera,webgl.domElement)
  sunsky      = new THREE.SF.SunskyLight()
  sphere      = new THREE.Mesh( new THREE.SphereGeometry(),new THREE.MeshLambertMaterial(0xff0000))

  # add
  scene.add camera
  scene.add sunsky
  scene.add sphere

  # position
  camera.position.set 0,0,-1000
  camera.lookAt new THREE.Vector3(0,0,0)

  # render
  render = ()->
    controls.update()
    webgl.render(scene,camera)
    requestAnimationFrame render
    null

  render()

  null






