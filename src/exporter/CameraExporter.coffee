
class CameraExporter extends BlockExporter

  constructor:()->
    super()

    @settings =
      enabled: true

    # for now, index the first camera we come across
    @camera = null

    console.log @

  addToIndex:(object3d)->
    if @camera
      return

    if object3d instanceof THREE.PerspectiveCamera
      @camera = object3d
      console.log "SET CAMERA", @camera

    null

  doTraverse:(object3d)->
    # check here for custom cameras.
    # we'll use some helper planes for viewport / render size
    # so we prevent traversing to stop the meshes being rendered.
    true

  exportBlock:()->
    result = ''

    if not @settings.enabled or not @camera
      return result

    result += 'camera {\n'
    result += '  type pinhole\n'
    result += '  eye ' + @exportVector(@camera.position) + '\n'
    result += '  target ' + @exportVector(@camera.rotation) + '\n'
    result += '  up ' + @exportVector(@camera.up) + "\n"
    result += '  fov ' + @camera.fov + '\n'
    result += '  aspect ' + @camera.aspect + '\n'
    result += '}\n\n'

    return result