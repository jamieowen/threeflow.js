
class Main

  constructor:()->

    # three sunflow renderer.
    @sunflowRenderer = new THREE.SunflowRenderer()
    @sunflowRenderer.connect()

    # standard three.js setup
    @renderer = new THREE.WebGLRenderer
      antialias:true

    document.body.appendChild @renderer.domElement

    @scene = new THREE.Scene()

    @width = window.innerWidth
    @height = window.innerHeight

    @renderer.setSize @width,@height

    # set these properties to null
    # so we can interchange the scene objects,lighting and camera setups

    @objectsSetup    = null
    @lightingSetup = null
    @cameraSetup  = null

    document.getElementById("renderButton").addEventListener( "click", @onRenderClick );

    @render()

  onRenderClick:(event)=>
    event.preventDefault()
    console.log "RENDER"
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
    if @objectsSetup
      @objectsSetup.update()

    if @lightingSetup
      @lightingSetup.update()

    if @cameraSetup
      @cameraSetup.update()
      camera = @cameraSetup.getActiveCamera()

    if camera
      camera.aspect = @width/@height
      @renderer.render @scene,camera


    requestAnimationFrame @render

    null




