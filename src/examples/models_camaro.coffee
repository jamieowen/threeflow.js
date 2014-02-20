
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
  scene.add sunsky
  scene.add plane

  # position objects
  camera.position.set 615,564,1910
  camera.lookAt new THREE.Vector3(0,0,0)
  plane.position.set 0,-218,0


  # create car materials
  materials =
    body:
      Orange: new THREEFLOW.ShinyMaterial
        color: 0xff6600
        #envMap: textureCube
        combine: THREE.MixOperation
        reflectivity: 0.3
      Blue: new THREE.MeshLambertMaterial
        color: 0x226699
        #envMap: textureCube
        combine: THREE.MixOperation
        reflectivity: 0.3

      Red: new THREE.MeshLambertMaterial
        color: 0x660000
        #envMap: textureCube
        combine: THREE.MixOperation
        reflectivity: 0.5

      Black: new THREE.MeshLambertMaterial
        color: 0x000000
        #envMap: textureCube
        combine: THREE.MixOperation
        reflectivity: 0.5

      White: new THREE.MeshLambertMaterial
        color: 0xffffff
        #envMap: textureCube
        combine: THREE.MixOperation
        reflectivity: 0.5

      Carmine: new THREE.MeshPhongMaterial
        color: 0x770000,
        specular: 0xffaaaa,
        #envMap: textureCube,
        combine: THREE.MultiplyOperation

      Gold: new THREE.MeshPhongMaterial
        color: 0xaa9944
        specular: 0xbbaa99
        shininess: 50
        #envMap: textureCube
        combine: THREE.MultiplyOperation

      Bronze: new THREE.MeshPhongMaterial
        color: 0x150505
        specular: 0xee6600
        shininess: 10
        #envMap: textureCube
        combine: THREE.MixOperation
        reflectivity: 0.5

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
    m.materials[ 4 ] = materials.glass # windshield
    m.materials[ 5 ] = materials.interior # interior
    m.materials[ 6 ] = materials.tire # tire
    m.materials[ 7 ] = materials.black # tireling
    m.materials[ 8 ] = materials.black # behind grille

    mesh = new THREE.Mesh geometry, m
    mesh.rotation.y = 1
    mesh.scale.set s,s,s

    scene.add mesh

  # create the sunflow renderer and connect.
  threeflow = new THREEFLOW.SunflowRenderer
    pngPath:"examples/renders/models_camaro.png"
    scPath:"examples/renders/models_camaro.sc"
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






