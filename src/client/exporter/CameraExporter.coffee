
class CameraExporter extends BlockExporter

  constructor:()->
    super()

    @camera = null

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

    if not @camera
      return result

    result += 'camera {\n'
    result += '  type pinhole\n'
    result += '  eye ' + @exportVector(@camera.position) + '\n'
    result += '  target ' + @exportVector(@camera.rotation) + '\n'
    result += '  up ' + @exportVector(@camera.up) + '\n'

    # TODO: multiplying the fov by the aspect ratio seems to correct
    # the sunflow renderer problems.
    # but not perfect.
    result += '  fov ' + @camera.fov*@camera.aspect + '\n'
    result += '  aspect ' + @camera.aspect + '\n'
    result += '}\n\n'

    return result