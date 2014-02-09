window.onload = function() {
  var camera, controls, gui, height, loader, plane, render, scene, sunsky, threeflow, webgl, width,
    _this = this;
  webgl = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("canvas")
  });
  width = webgl.domElement.width;
  height = webgl.domElement.height;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, width / height, 1, 100000);
  controls = new THREE.TrackballControls(camera, webgl.domElement);
  sunsky = new THREEFLOW.SunskyLight({
    direction: new THREE.Vector3(0.6, 0.8, 0.5)
  });
  plane = new THREE.Mesh(new THREEFLOW.InfinitePlaneGeometry(), new THREE.MeshLambertMaterial({
    color: 0xefefef,
    side: THREE.DoubleSide,
    wireframe: true
  }));
  scene.add(camera);
  scene.add(sunsky);
  scene.add(plane);
  loader = new THREE.JSONLoader();
  loader.load("models/flamingo.json", function(geometry) {
    var anim, color, colorCount, colorHash, colorMap, count, faceMaterial, heightInc, hex, i, idx, material, materials, offset, spacing, _i, _j, _len, _ref;
    if (geometry.morphColors && geometry.morphColors.length) {
      colorMap = geometry.morphColors[0];
      colorHash = {};
      colorCount = 0;
      _ref = colorMap.colors;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        color = _ref[i];
        hex = color.getHexString();
        idx = colorHash[hex];
        if (isNaN(idx)) {
          colorHash[hex] = colorCount;
          idx = colorCount;
          colorCount++;
        }
        geometry.faces[i].color = color;
        geometry.faces[i].materialIndex = idx;
      }
    }
    geometry.computeMorphNormals();
    materials = [];
    for (color in colorHash) {
      material = new THREEFLOW.DiffuseMaterial({
        color: parseInt(color, 16),
        morphTargets: true,
        morphNormals: true,
        shading: THREE.FlatShading
      });
      materials.push(material);
    }
    faceMaterial = new THREE.MeshFaceMaterial(materials);
    count = geometry.morphTargets.length;
    spacing = 120;
    offset = count * (spacing / 2);
    heightInc = 20;
    for (i = _j = 0; 0 <= count ? _j < count : _j > count; i = 0 <= count ? ++_j : --_j) {
      anim = new THREE.MorphAnimMesh(geometry, faceMaterial);
      anim.position.set((i * spacing) - offset, 100 + (i * heightInc), 0);
      scene.add(anim);
    }
    camera.position.set(-(offset + (spacing * 2)), 147, 90);
    return camera.lookAt(new THREE.Vector3(0, 300, 0));
  });
  threeflow = new THREEFLOW.SunflowRenderer({
    pngPath: "examples/renders/models_flamingo.png",
    scPath: "examples/renders/models_flamingo.sc"
  });
  threeflow.connect();
  gui = new THREEFLOW.DatGui(threeflow);
  gui.onRender = function() {
    return threeflow.render(scene, camera, width, height);
  };
  render = function() {
    controls.update();
    webgl.render(scene, camera);
    requestAnimationFrame(render);
    return null;
  };
  render();
  return null;
};
