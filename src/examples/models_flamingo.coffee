
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
    direction:new THREE.Vector3(0.6,0.8,0.5)

  plane       = new THREE.Mesh new THREEFLOW.InfinitePlaneGeometry(),new THREE.MeshLambertMaterial
    color:0xefefef
    side: THREE.DoubleSide
    wireframe:true

  # add to scene
  scene.add camera
  scene.add sunsky
  scene.add plane


  loader = new THREE.JSONLoader()
  loader.load "models/flamingo.json",(geometry)=>

    if geometry.morphColors && geometry.morphColors.length
      colorMap = geometry.morphColors[ 0 ]
      colorHash = {}
      colorCount = 0
      for color, i in colorMap.colors
        hex = color.getHexString()
        idx = colorHash[hex]
        if isNaN idx
          colorHash[hex] = colorCount
          idx = colorCount
          colorCount++

        geometry.faces[ i ].color = color
        geometry.faces[ i ].materialIndex = idx

    geometry.computeMorphNormals()

    materials = []
    for color of colorHash
      #material =  new THREEFLOW.PhongMaterial
      material =  new THREEFLOW.DiffuseMaterial
        color: parseInt(color,16)
        #specular: 0x333333
        #shininess: 1
        morphTargets: true
        morphNormals: true
        shading: THREE.FlatShading

      materials.push material

    faceMaterial = new THREE.MeshFaceMaterial materials

    # create some flamingos
    count = geometry.morphTargets.length
    spacing = 120
    offset = count*(spacing/2)
    heightInc = 20

    for i in [0...count]
      anim = new THREE.MorphAnimMesh geometry,faceMaterial
      anim.position.set((i*spacing)-offset,100 + (i*heightInc),0)

      #anim.updateAnimation( delta )
      scene.add anim

    camera.position.set -(offset+(spacing*2)),147,90
    camera.lookAt(new THREE.Vector3(0,300,0))



  # create the sunflow renderer and connect.
  threeflow = new THREEFLOW.SunflowRenderer
    pngPath:"examples/renders/models_flamingo.png"
    scPath:"examples/renders/models_flamingo.sc"

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






