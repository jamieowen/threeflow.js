
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

  ambient     = new THREE.AmbientLight(0xffffff)

  plane       = new THREE.Mesh new THREEFLOW.InfinitePlaneGeometry(),new THREE.MeshLambertMaterial
    color:0xffffff
    wireframe:true

  plane2       = new THREE.Mesh new THREEFLOW.InfinitePlaneGeometry(),new THREE.MeshLambertMaterial
    color:0xffffff
    wireframe:true

  # add to scene
  scene.add camera
  scene.add ambient
  scene.add plane
  scene.add plane2

  # position objects
  camera.position.set 15,0,-200
  camera.lookAt new THREE.Vector3(0,0,0)
  plane.position.set 0,-20,0
  plane2.position.set 0,20,0

  # create threeflow point lights
  simplex = new SimplexNoise()
  simplexSmooth = .1
  size = 25
  gridX = 10
  gridZ = 10
  offset = new THREE.Vector3 -(gridX*size)/2,0,-(gridZ*size)/2

  geometry = new THREE.SphereGeometry 6
  material = new THREEFLOW.ShinyMaterial
    wireframe: true
    color: 0xffffff

  count = 0
  for ix in [0...gridX]
    for iz in [0...gridZ]
      light = new THREEFLOW.PointLight()
      lightPower = 700 #((simplex.noise(ix*simplexSmooth,iz*simplexSmooth)+1)/2)*500
      light.position.set ix*size,simplex.noise(ix*simplexSmooth,iz*simplexSmooth)*15,iz*size
      light.position.add offset

      sphere = new THREE.Mesh geometry,material
      sphere.position.copy light.position
      light.power = lightPower

      light.color.setHSL( count++/(gridX*gridZ),1,.5 )

      light.position.y -= 7
      scene.add sphere
      scene.add light

  # create the sunflow renderer and connect.
  threeflow = new THREEFLOW.SunflowRenderer
    pngPath:"examples/renders/lights_point.png"
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






