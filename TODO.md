
# IGNORE - Out of date..

# Todo

## Lights

## Getters/Setters
- Getters and setters to effect simulated light when properties change.


- Color Spaces?


# Simulate lighting setup..

## Dat GUI

- remove sunsky settings **done**
- build context GI **done(ish)**
- add render & preview buttons **done**
- look into saving settings

## Exporter

- move settings vars to local **done**
- handle sunsky from object **done**
- map block exporters to renderer **done**
- add accessors to static types **done**

*Later*

- Mesh mapping to higher geometry

## Lights

All Lights should extend Object3D and give the option of adding markers & real three.js lights.
- Area/Mesh Light *done*
- On/off THREE lights (for many lights)
- Directional Lights
- SkyLight - ( Match Three )

## Geometry / Mesh
- Infinite Plane ( finish ) **done**
- Face Materials ** done **
- Face Colors

## Renderer
- add render path to save **done**
- save options

## Examples

*AO Renders Only*

- geometry_cubes_basic
- geometry_cubes_gen
- geometry_spheres_primitive
- geometry_spheres_gen
- geometry_platonics

- materials_constant **done**
- materials_diffuse **done**
- materials_phong **done**
- materials_shiny **done**
- materials_glass **done**
- materials_mirror **done**

### General Scene Support

1. Basic Scene File Export **done**
2. Local Transforms **done**
3. World Transforms **done**
4. Object Instancing **done**


### Image Settings

1. Antialiasing **done**
2. Samples **done**
3. Contrast Threshold **done**
4. Filters **done**
5. Jitter **done**
6. Bucket Size/Order
7. Alpha Channels
8. Predefined Settings.

### Command Line Options
1. No GUI
2. see docs...


### Global Illumination
1. Types **done**
2. Samples **done**
3. Sets **done**
4. Bias **done**
5. Bias Samples **done**
6. Need to rewrite to include all GI types.

### Shaders

**Note** Needs testing and examples created.


7. Ward Shader
8. Ambient Occlusion Shader
9. Uber Shader
10. Janino Wire Shader
11. Other Janino Shaders?
11. Textured Shaders?

### Cameras

**Note**
Will create specific camera objects that extend three.js classes.
Target camera will have to be passed into the render() method, the same as three.js renderers.
Include camera geometry model to show camera direction.
Exporter will have to prevent traversing into that mesh.

1. Pinhole *done*
2. Thinlens ( Bokeh/DOF )
3. Fisheye
4. FOV / Aspect Match problems http://forum.processing.org/one/topic/coding-opengl-sunflow.html

### Lights

Lights should be implemented in a similar way to cameras.

1. Point Light
2. Meshlight/Area Light
3. Spherical Light
4. Directional Light
5. Image Based Light ( HDR )
6. Sunsky

### Meshes
1. Triangle Mesh Basics *done*
2. Triangle Mesh Vertex/Face Normals
3. Separate Face Shaders
4. Bezier Patches
5. File Meshes ( OBJ,STL,RA3 )

### Primitive Mapping.
1. Background
2. Plane
3. Sphere **done**
4. Particle
5. Torus
6. Box
7. Cylinder
8. Others ( see doc )

### Modifiers
1. Bump Map
2. Normal Map
3. Perlin Noise

### High Resolutions ( >16K )
1. Recompile ( see docs pg 137 )

### Animation
1. Scene File Sequences.

### Lightmap / Baking
1. Possibly
2. See docs after page 143 for more...

### Other / Own stuff
1. Lighting Rig
2. Special Camera ( showing render size )
3. Rendering for print.

### Server Related.
1. Accurate Render Progress
2. Piping of stdout back to browser
3. Png save path
4. No Gui and reload back in browser


