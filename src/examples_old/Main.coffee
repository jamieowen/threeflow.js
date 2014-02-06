
class Main

  constructor:()->

    # three sunflow renderer.
    @sunflowRenderer = new THREE.SunflowRenderer()
    @sunflowRenderer.connect()
    @gui = new THREEFLOW.DatGui(@sunflowRenderer)

    # standard three.js setup
    @renderer = new THREE.WebGLRenderer
      antialias:true

    document.body.appendChild @renderer.domElement

    @scene = new THREE.Scene()

    @width = window.innerWidth
    @height = window.innerHeight

    @renderer.setSize @width,@height

    # default camera
    @camera = new THREE.PerspectiveCamera(35,@width/@height,100,10000)
    @camera.position.set 0,1000,-1000
    @camera.lookAt new THREE.Vector3()
    @scene.add @camera

    @controls = new THREE.TrackballControls @camera, @renderer.domElement

    # set these properties to null
    # so we can interchange the scene objects,lighting and camera setups
    @objectsSetup    = null
    @lightingSetup = null
    @cameraSetup  = null


    # add render click temp for ui.
    document.getElementById("renderButton").addEventListener( "click", @onRenderClick );

    @render()

  onRenderClick:(event)=>
    event.preventDefault()
    @sunflowRenderer.render( @scene, @cameraSetup.getActiveCamera(),@width,@height)


  setObjectsSetup:(objectsSetup)->
    if @objectsSetup
      @objectsSetup.remove( @scene )

    @objectsSetup = objectsSetup

    if @objectsSetup
      @objectsSetup.add( @scene )
    null

  setCameraSetups:(cameraSetup)->
    if @cameraSetup
      @cameraSetup.remove( @scene )

    @cameraSetup = cameraSetup

    if @cameraSetup
      @cameraSetup.add( @scene )

    null

  setLightingSetup:(lightingSetup)->
    if @lightingSetup
      @lightingSetup.remove( @scene )

    @lightingSetup = lightingSetup

    if @lightingSetup
      @lightingSetup.add( @scene )

    null


  render:()=>

    @controls.update()

    if @objectsSetup
      @objectsSetup.update()

    if @lightingSetup
      @lightingSetup.update()

    #if @cameraSetup
    #  @cameraSetup.update()
    #  camera = @cameraSetup.getActiveCamera()

    #if camera
    #  camera.aspect = @width/@height
    #  camera.updateProjectionMatrix()

    @renderer.render @scene,@camera


    requestAnimationFrame @render

    null




