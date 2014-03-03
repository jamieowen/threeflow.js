# Materials

## Basics
![Constant Material](renders/materials_all.png)

Info to come..

## Constant Material
![Constant Material](renders/materials_constant.png)

```coffee
material = new THREEFLOW.ConstantMaterial
  color: 0xff0000

geometry = new THREE.SphereGeometry()
mesh     = new THREE.Mesh geometry,material

scene.add mesh
```


## Diffuse Material
![Diffuse Material](renders/materials_diffuse.png)

```coffee
material = new THREEFLOW.DiffuseMaterial
  color: 0xff0000

geometry = new THREE.SphereGeometry()
mesh     = new THREE.Mesh geometry,material

scene.add mesh
```

## Phong Material
![Phong Material](renders/materials_phong.png)
*need to render this again*

```coffee
material = new THREEFLOW.PhongMaterial
  color: 0xff0000
  specular: 0xffffff
  samples: 4
  power: 50

geometry = new THREE.SphereGeometry()
mesh     = new THREE.Mesh geometry,material

scene.add mesh
```

## Shiny Material
![Shiny Material](renders/materials_shiny.png)

```coffee
material = new THREEFLOW.ShinyMaterial
  color: 0xff0000
  reflection: 0.5

geometry = new THREE.SphereGeometry()
mesh     = new THREE.Mesh geometry,material

scene.add mesh
```

## Glass Material
![Glass Material](renders/materials_glass.png)

```coffee
material = new THREEFLOW.GlassMaterial
  color: 0xff0000
  eta: 1.33

geometry = new THREE.SphereGeometry()
mesh     = new THREE.Mesh geometry,material

scene.add mesh
```

## Mirror Material
![Mirror Material](renders/materials_mirror.png)

```coffee
material = new THREEFLOW.MirrorMaterial
  color: 0xff0000
  reflection: 0xffffff

geometry = new THREE.SphereGeometry()
mesh     = new THREE.Mesh geometry,material

scene.add mesh
```

