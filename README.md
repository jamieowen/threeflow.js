
# Threeflow.js

![Geometry Cubes](examples/renders/geometry_cubes.png)

Will create an npm module for this but for now:
```shell
# clone git
git clone git@github.com:jamieowen/threeflow.js.git

# start the server on http://localhost:3000
grunt server

# open a new terminal tab and start grunt dev to modify and recompile examples.
# or just visit http://localhost:3000 in the browser
grunt dev
```

![Camaro](examples/renders/models_camaro.png)

![Camaro](examples/renders/models_flamingo.png)

## Reference

+ Sunflow Site - http://sunflow.sourceforge.net/

+ Sunflow Wiki - http://geneome.com/sunflow/sfwiki.pdf

+ Sunflow Source - http://sourceforge.net/projects/sunflow/  ( ScParser.java for understanding the sc format )

+ Sunflow FAQ - http://home.comcast.net/~gamma-ray/sf/sunflow-faq.htm ( Useful info on rendering )


## Roadmap


### General Scene Support

1. Basic Scene File Export **done**
2. Local Transforms **done**
3. World Transforms **done**
4. Object Instancing **done**
6. Color Spaces?

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

1. Constant Shader **done**
2. Diffuse Shader **done**
3. Phong Shader **done**
4. Shiny Shader **done**
5. Glass Shader **done**
6. Mirror Shader **done**
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

1. Pinhole
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














