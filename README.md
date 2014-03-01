
#threeflow.js : Sunflow for three.js

### Overview

To come..

### Major to-do.
+ ao materials & ao overrides
+ node server work & npm package.
+ export normals & uvs > texture support

### Installation

Installation via npm. Will run a local socket server that projects can connect to..
```shell
# npm package to come..
```

------------------------------------------------------------------------------
#### Screenshot
![Screenshot](screenshot.jpg)

------------------------------------------------------------------------------
#### Quick render examples so far

*1. Camaro
![Camaro](templates/default/deploy/renders/camaro.png)

*2. Lee Perry Smith
![Lee Perry Smith](templates/default/deploy/renders/lee_perry_smith.png)

*3. Suzanne
![Suzanne](templates/default/deploy/renders/suzanne.png)



------------------------------------------------------------------------------

### Usage
To come..

**coffescript example:**
```coffee
# create an instance of the renderer
# along with some render output paths

renderer = new THREEFLOW.SunflowRenderer
  pngPath: "renders/myRender.png"

# connect to the socket server.
renderer.connect()

# to render a three.js scene:
renderer.render scene,camera,width,height

```

### Examples
[Example source can be found here](src/examples)

### Materials
[Material documentation found here](src/client/materials)

### Lights
[Lights documentation found here](src/client/lights)

### References

The majority of the information on Sunflow can be found in the Sunflow Wiki.
To better understand the full .sc file parser, the source code for the parser can be
found in the ScParser.java file in the source.

**Sunflow Site**

+ http://sunflow.sourceforge.net/

**Sunflow Wiki**

+ http://www.geneome.com/sunflow-wiki/
+ http://geneome.com/sunflow/sfwiki.pdf

**Sunflow Source**

+ https://github.com/fpsunflower/sunflow
+ https://github.com/fpsunflower/sunflow/blob/master/src/org/sunflow/core/parser/SCParser.java

**Sunflow Misc**

+ http://home.comcast.net/~gamma-ray/sf/sunflow-faq.htm


------------------------------------------------------------------------------




















