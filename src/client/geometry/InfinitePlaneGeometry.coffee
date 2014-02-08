
THREEFLOW.InfinitePlaneGeometry = (width, height, widthSegments, heightSegments)->
  width  = width || 10000
  height = height || 10000
  widthSegments = widthSegments || 100
  heightSegments = heightSegments || 100

  THREE.PlaneGeometry.call @,width,height,widthSegments,heightSegments

THREEFLOW.InfinitePlaneGeometry.prototype = Object.create( THREE.PlaneGeometry.prototype )

