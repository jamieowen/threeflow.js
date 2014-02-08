
THREEFLOW.InfinitePlaneGeometry = (width, height, widthSegments, heightSegments)->

  width  = width || 1000
  height = height || 1000
  widthSegments = widthSegments || 10
  heightSegments = heightSegments || 10

  THREE.PlaneGeometry.call @,width,height,widthSegments,heightSegments

  matrix = new THREE.Matrix4()
  matrix.makeRotationX Math.PI/2
  @applyMatrix matrix

  normal = new THREE.Vector3 0,1,0

  for face in @faces
    face.normal.copy normal
    face.vertexNormals[0].copy normal
    face.vertexNormals[1].copy normal
    face.vertexNormals[2].copy normal

  @computeCentroids()

THREEFLOW.InfinitePlaneGeometry.prototype = Object.create( THREE.PlaneGeometry.prototype )

