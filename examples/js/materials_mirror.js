window.onload = function() {
  var camera, controls, count, geometry, grid, gui, height, ix, iz, material, mesh, offset, plane, render, scene, size, spacing, sunsky, threeflow, webgl, width, _i, _j,
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
  sunsky = new THREEFLOW.SunskyLight;
  plane = new THREE.Mesh(new THREEFLOW.InfinitePlaneGeometry(), new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
  }));
  scene.add(camera);
  scene.add(sunsky);
  scene.add(plane);
  size = 8;
  spacing = 20;
  grid = 4;
  offset = (spacing * (grid - 1)) / 2;
  geometry = new THREE.SphereGeometry(size);
  count = 0;
  for (ix = _i = 0; 0 <= grid ? _i < grid : _i > grid; ix = 0 <= grid ? ++_i : --_i) {
    for (iz = _j = 0; 0 <= grid ? _j < grid : _j > grid; iz = 0 <= grid ? ++_j : --_j) {
      material = new THREEFLOW.MirrorMaterial;
      material.reflection.setHSL(count / (grid * grid), 0.6, 0.6);
      material.color.setHSL(count / (grid * grid), 0.6, 0.6);
      count++;
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((ix * spacing) - offset, size, (iz * spacing) - offset);
      scene.add(mesh);
    }
  }
  camera.position.set(grid * spacing, size * 10, grid * spacing);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  threeflow = new THREEFLOW.SunflowRenderer({
    pngPath: "examples/renders/materials_mirror.png",
    scPath: "examples/renders/materials_mirror.sc"
  });
  threeflow.connect();
  gui = new THREEFLOW.DatGui(threeflow);
  gui.onRender = function() {
    return threeflow.render(scene, camera, width, height);
  };
  gui.onPreview = function() {
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
