

THREEFLOW.InfinitePlaneGeometry = (width, height, widthSegments, heightSegments)->
    console.log "widh", arguments
    THREE.PlaneGeometry.call @,arguments


    #width  = width || 10000
    #height = height || 10000
    #widthSegments = widthSegments || 100
    #heightSegments = heightSegments || 100

    #super(width,height,widthSegments,heightSegments)
    console.log "widhaf", @width
    #console.log width,height,widthSegments,heightSegments



  console.log "LOG SHIT"
THREEFLOW.InfinitePlaneGeometry.prototype = Object.create( THREE.PlaneGeometry.prototype )
#THREEFLOW.InfinitePlaneGeometry.prototype.constructor = THREEFLOW.InfinitePlaneGeometry

