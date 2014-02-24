
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
  controls    = new THREE.OrbitControls(camera,webgl.domElement)

  ambient     = new THREE.AmbientLight 0x333333
  scene.add ambient

  rig         = new THREEFLOW.LightingRig()

  scene.add rig
  scene.add camera


  size = 30
  geom = new THREE.SphereGeometry(size,size)
  geom.computeBoundingBox()
  count = 16
  radius = ((size*2)*(count+4))/(Math.PI*2)

  spheres = new THREE.Object3D()

  for i in [0...count]
    material = new THREEFLOW.ShinyMaterial()
    material.color.setHSL(i/count,.7,.5)
    mesh = new THREE.Mesh(geom,material)
    theta = ((Math.PI*2)/count)*i
    mesh.position.x = radius * Math.cos(theta)
    mesh.position.y = -geom.boundingBox.min.y
    mesh.position.z = radius * Math.sin(theta)
    spheres.add mesh

  # rotate to bring other colours round.
  spheres.rotation.y = Math.PI/2
  scene.add spheres

  loader = new THREE.JSONLoader()
  loader.load "models/suzanne.json",(geometry)=>
    subdiv = new THREE.SubdivisionModifier(2)
    subdiv.modify geometry

    geometry.computeBoundingBox()
    material = new THREEFLOW.ShinyMaterial()
    mesh = new THREE.Mesh geometry,material
    # scale to desired height
    scale = 200 / ( geometry.boundingBox.max.y - geometry.boundingBox.min.y )
    mesh.scale.set(scale,scale,scale)
    mesh.position.y = (geometry.boundingBox.max.y*0.535)*scale
    mesh.rotation.order = "YXZ"
    mesh.rotation.x = -(Math.PI/5)
    mesh.rotation.y = Math.PI/4

    #mesh = new THREE.Mesh( new THREE.SphereGeometry(100), material )
    #mesh.position.y = 100
    scene.add mesh

  camera.position.set 0,400,2000


  # create the sunflow renderer and connect.
  threeflow = new THREEFLOW.SunflowRenderer
    pngPath:"examples/renders/extras_lighting_rig.png"
    scPath:"examples/renders/extras_lighting_rig.sc"

  threeflow.connect()

  # gui
  renderGui = new THREEFLOW.DatGui threeflow
  renderGui.onRender=()=>
    threeflow.render scene,camera,width,height

  new THREEFLOW.LightingRigGui(rig)

  # render
  render = ()->
    controls.update()
    rig.update()
    webgl.render(scene,camera)
    requestAnimationFrame render
    null

  render()

  null






