
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
  sunsky      = new THREEFLOW.SunskyLight

  plane       = new THREE.Mesh new THREEFLOW.InfinitePlaneGeometry(),new THREE.MeshLambertMaterial
    color:0xffffff
    side: THREE.DoubleSide
    wireframe:true

  # add to scene
  scene.add camera
  scene.add sunsky
  scene.add plane

  size = 8
  spacing = 20
  grid = 4
  offset = (spacing*(grid-1))/2

  geometry = new THREE.SphereGeometry size

  eta = [0.8,1.1,1.33,1.5]
  count = 0
  for ix in [0...grid]
    for iz in [0...grid]
      material = new THREEFLOW.GlassMaterial
        eta: eta[ix]

      material.color.setHSL( count/(grid*grid),0.6,0.6)
      count++
      mesh = new THREE.Mesh geometry,material
      mesh.position.set (ix*spacing)-offset,size,(iz*spacing)-offset
      scene.add mesh


  camera.position.set grid*spacing,size*10,grid*spacing
  camera.lookAt new THREE.Vector3(0,0,0)

  # create the sunflow renderer and connect.
  threeflow = new THREEFLOW.SunflowRenderer
    pngPath:"examples/renders/materials_glass.png"
    scPath:"examples/renders/materials_glass.sc"

  threeflow.connect()

  # gui
  gui = new THREEFLOW.RendererGui threeflow
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






