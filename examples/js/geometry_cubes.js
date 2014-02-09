window.onload = function() {
  var camera, controls, cube, cubeScale, geometry, gridX, gridZ, gui, height, ix, iz, material, offset, plane, render, scale, scene, simplex, simplexSmooth, size, sunsky, threeflow, webgl, width, _i, _j,
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
    simulate: true,
    direction: new THREE.Vector3(0.06, .03, 0)
  });
  plane = new THREE.Mesh(new THREEFLOW.InfinitePlaneGeometry(), new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
  }));
  scene.add(camera);
  scene.add(sunsky);
  scene.add(plane);
  simplex = new SimplexNoise();
  simplexSmooth = .05;
  size = 30;
  gridX = 40;
  gridZ = 40;
  scale = 10;
  offset = new THREE.Vector3(-(gridX * size) / 2, 0, -(gridZ * size) / 2);
  geometry = new THREE.CubeGeometry(size, size, size);
  material = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  for (ix = _i = 0; 0 <= gridX ? _i < gridX : _i > gridX; ix = 0 <= gridX ? ++_i : --_i) {
    for (iz = _j = 0; 0 <= gridZ ? _j < gridZ : _j > gridZ; iz = 0 <= gridZ ? ++_j : --_j) {
      cube = new THREE.Mesh(geometry, material);
      cubeScale = ((simplex.noise(ix * simplexSmooth, iz * simplexSmooth) + 1) / 2) * scale;
      cube.scale.set(1, cubeScale, 1);
      cube.position.set(ix * size, (cubeScale * size) / 2, iz * size);
      cube.position.add(offset);
      scene.add(cube);
    }
  }
  camera.position.set(1100, 1200, 1100);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  threeflow = new THREEFLOW.SunflowRenderer({
    pngPath: "examples/renders/geometry_cubes.png",
    scPath: "examples/renders/geometry_cubes.sc"
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
