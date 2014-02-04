
class BasicCameraSetup
  constructor:()->
    @inited = false

  init:()->
    if @inited
      return

    @inited = true

    @camera = new THREE.PerspectiveCamera 35,800/600,100,10000
    @camera.position.z = -1000
    @camera.position.y = 1000
    @camera.lookAt new THREE.Vector3()

    @controls = new THREE.TrackballControls @camera
    #,renderer.domElement

    null


  add:(scene)->
    @init()

    scene.add @camera

    null

  remove:(scene)->
    scene.remove @camera

    null

  getActiveCamera:()->
    return @camera


  update:()->
    @controls.update()
    null