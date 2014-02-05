
THREE.SF.PointLight = class PointLight extends THREE.PointLight

  constructor:( hex, intensity, distance )->
    super( hex, intensity, distance )

    THREE.PointLight.call @

    geometry = new THREE.SphereGeometry 6,3,3
    material = new THREE.MeshBasicMaterial
      color: 0x0000ff
      wireframe: true

    @mesh = new THREE.Mesh geometry,material
    @add @mesh