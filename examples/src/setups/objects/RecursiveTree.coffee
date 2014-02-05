
class RecursiveTree
  constructor:()->
    @inited = false

  init:()->
    if @inited
      return

    @inited = true

    # generate segment data
    start = new THREE.Vector3()
    rotation = new THREE.Vector3()
    direction = new THREE.Vector3(0,1,0)
    maxBranch = 3
    maxDepth = 5

    @nodes = []

    @branch( start,direction,rotation,maxBranch,maxDepth,0,null,@nodes )

    @meshes
    @plot(@nodes)

  branch:(start,direction,rotation,maxBranch,maxDepth,currentDepth,parent,results)->
    if currentDepth is maxDepth
      return

    # one branch for depth 0
    if currentDepth is 0
      branchCount = 1
    else
      branchCount = maxBranch

    for i in [0...branchCount]
      node =
        start: start.clone()
        end: start.clone().add(direction).multiplyScalar(40)
        direction: direction.clone()
        parent: parent

      results.push node

    null

  # plot the nodes for debug with spheres.
  plot:(nodes)->





  add:(scene)->
    @init()

    for mesh in @meshes
      scene.add mesh

    null

  remove:(scene)->

    for mesh in @meshes
      scene.remove mesh

    null

  update:()->
    null


