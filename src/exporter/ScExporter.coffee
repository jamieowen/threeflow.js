class ScExporter

  @export:(scene,camera,width,height)->
    index      = ScExporter.buildIndex scene

    scContents = "\n% Three.js generated Sunflow scene file.\n"

    scContents += 'image {\n'
    scContents += '  resolution ' + width + ' ' + height + '\n'
    scContents += '  aa 0 1\n'
    scContents += '  filter triangle\n'
    scContents += '}\n\n'

    # add temp light
    scContents += 'light {\n'
    scContents += '  type sunsky\n'
    scContents += '  up 0 1 0\n'
    scContents += '  east 0 0 1\n'
    scContents += '  sundir 1 1 1\n'
    scContents += '  turbidity 4\n'
    scContents += '  samples 64\n'
    scContents += '}\n\n'

    scContents += @exportCamera camera
    scContents += @exportShaders index
    scContents += @exportObjects index

    ScExporter.disposeIndex index

    scContents

  @buildIndex:(scene)->

    materialMap = {}
    meshMap     = {}
    geometryMap = {}

    map = (object3d)->
      if object3d instanceof THREE.Mesh
        # map all geometry, materials and meshes.
        meshMap[ object3d.uuid ]              = object3d
        geometryMap[ object3d.geometry.uuid ] = object3d.geometry
        materialMap[ object3d.material.uuid ] = object3d.material

      else if object3d instanceof THREE.Camera
        console.log "camera", object3d

    traverse = (object3d)->
      if object3d.children.length
        for child in object3d.children
          map child
          traverse child

    traverse scene

    index =
      materials: materialMap
      geometries: geometryMap
      meshes: meshMap

    index

  @disposeIndex:(index)->
    for key of index.materials
      index.materials[key] = null
      delete index.materials[key]

    for key of index.geometries
      index.geometries[key] = null
      delete index.geometries[key]

    for key of index.meshes
      index.meshes[key] = null
      delete index.meshes[key]

    null

  @exportCamera:(camera)->
    scContents = ''

    if camera instanceof THREE.PerspectiveCamera
      scContents += 'camera {\n'
      scContents += '  type pinhole\n'
      scContents += '  eye ' + ScExporter.exportVector(camera.position) + '\n'
      scContents += '  target ' + ScExporter.exportVector(camera.rotation) + '\n'
      #scContents += '  target ' + ScExporter.exportVector( new THREE.Vector3(0,0,0) ) + '\n'
      scContents += '  up ' + ScExporter.exportVector(camera.up) + "\n"
      scContents += '  fov ' + ( camera.fov + 50 ) + '\n'
      scContents += '  aspect ' + camera.aspect + '\n'
      scContents += '}\n\n'
    else
      console.log "Unsupported camera type"

    scContents

  @exportShaders:(index)->
    scContents = ''
    for material of index.materials
      material = index.materials[ material ]
      scContents += 'shader {\n'
      scContents += '  name ' + material.uuid + '\n'
      scContents += '  type diffuse\n'
      scContents += '  diff ' + ScExporter.exportColor(material.color) + '\n'
      scContents += '}\n\n'

    scContents


  @exportObjects:(index)->
    scContents = ''
    for mesh of index.meshes
      mesh = index.meshes[mesh]
      if mesh.geometry instanceof THREE.SphereGeometry
        scContents += 'object {\n'
        scContents += '  shader ' + mesh.material.uuid + '\n'
        scContents += '  type sphere\n'
        scContents += '  name ' + mesh.uuid + '\n'
        scContents += '  c ' + ScExporter.exportVector(mesh.position) + '\n'
        scContents += '  r ' + mesh.geometry.radius + '\n'
        scContents += '}\n\n'

    scContents

  @exportVector:(vector)->
    vector.x + " " + vector.y + " " + vector.z

  @exportColor:(color)->
    '{ "sRGB nonlinear" ' + color.r + ' ' + color.g + ' ' + color.b + ' }'

