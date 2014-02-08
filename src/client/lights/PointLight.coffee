

THREEFLOW.PointLight = ( hex, intensity, distance )->

  THREE.Object3D.call @

  @power = 500 #params.power || 10
  @color = new THREE.Color 0xffffff

  geometry = new THREE.SphereGeometry 2,3,3
  material = new THREE.MeshBasicMaterial
    color: 0x0000ff
    wireframe: true

  @mesh = new THREE.Mesh geometry,material
  @add @mesh

  #@light = new THREE.PointLight()

THREEFLOW.PointLight:: = Object.create THREE.Object3D::












