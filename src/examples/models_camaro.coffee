
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
    simulate: true
    direction: new THREE.Vector3 0.06,.03,0

  plane       = new THREE.Mesh new THREEFLOW.InfinitePlaneGeometry(),new THREE.MeshLambertMaterial
    color:0xffffff
    side: THREE.DoubleSide
    wireframe:true

  # add to scene
  scene.add camera
  #scene.add sunsky
  scene.add plane

  # position objects
  camera.position.set 615,564,1910
  camera.lookAt new THREE.Vector3(0,0,0)
  plane.position.set 0,-218,0

  light = new THREEFLOW.AreaLight
    geometry: new THREE.PlaneGeometry 400,400
    radiance: 70

  scene.add light
  light.position.set 300,600,300
  light.lookAt plane.position

  light = new THREEFLOW.AreaLight
    geometry: new THREE.PlaneGeometry 400,400
    radiance: 60

  scene.add light
  light.position.set 500,600,-300
  light.lookAt plane.position


  # create car materials
  materials =
    body:
      Orange: new THREEFLOW.ShinyMaterial
        color: 0xff6600
        #envMap: textureCube
        combine: THREE.MixOperation
        reflectivity: 0.3

      Chrome: new THREE.MeshPhongMaterial
        color: 0xffffff
        specular:0xffffff
        #envMap: textureCube
        combine: THREE.MultiplyOperation

    chrome: new THREEFLOW.MirrorMaterial
      color: 0xffffff
      reflection: 0xffffff
      #envMap: textureCube

    darkchrome: new THREEFLOW.MirrorMaterial
      color: 0x444444
      reflection: 0x444444
      #envMap: textureCube

    glass: new THREEFLOW.GlassMaterial
      color: 0x223344
      #envMap: textureCube
      opacity: 0.25
      combine: THREE.MixOperation
      reflectivity: 0.25
      transparent: true

    tire: new THREEFLOW.DiffuseMaterial
      color: 0x050505

    interior: new THREE.MeshPhongMaterial
      color: 0x050505
      shininess: 20

    black: new THREE.MeshLambertMaterial
      color: 0x000000

  loader = new THREE.BinaryLoader()
  loader.load "/models/CamaroNoUv_bin.js",(geometry)->
    s = 75
    m = new THREE.MeshFaceMaterial()

    m.materials[ 0 ] = materials.body[ "Orange" ]# // car body
    m.materials[ 1 ] = materials.chrome # wheels chrome
    m.materials[ 2 ] = materials.chrome # grille chrome
    m.materials[ 3 ] = materials.darkchrome # door lines


    # TODO : Errors when using the GlassMaterial
    m.materials[ 4 ] = materials.black #materials.glass # windshield
    m.materials[ 5 ] = materials.black ##materials.interior # interior
    m.materials[ 6 ] = materials.tire # tire
    m.materials[ 7 ] = materials.black # tireling
    m.materials[ 8 ] = materials.black # behind grille

    material = new THREEFLOW.DiffuseMaterial()

    mesh = new THREE.Mesh geometry,m
    mesh.rotation.y = 1
    mesh.scale.set s,s,s

    scene.add mesh

    vertexNormals = new THREE.VertexNormalsHelper(mesh,10)
    scene.add vertexNormals

  # create the sunflow renderer and connect.
  threeflow = new THREEFLOW.SunflowRenderer
    pngPath:"examples/renders/models_camaro.png"
    scPath:"examples/renders/models_camaro.sc"
    scale:0.25

  threeflow.connect()

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






