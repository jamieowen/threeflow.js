window.onload = function() {
  var ambientLight, areaLight1, areaLight2, camera, controls, cube, cubeScale, geometry, gridX, gridZ, gui, height, ix, iz, lightGeom, material, offset, plane, render, scale, scene, simplex, simplexSmooth, size, threeflow, webgl, width, _i, _j,
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
  ambientLight = new THREE.AmbientLight();
  plane = new THREE.Mesh(new THREEFLOW.InfinitePlaneGeometry(), new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
  }));
  lightGeom = new THREE.PlaneGeometry(30, 30);
  areaLight1 = new THREEFLOW.AreaLight({
    color: 0xff9999,
    radiance: 40,
    simulate: false,
    geometry: lightGeom
  });
  areaLight1.position.set(-100, 70, 100);
  areaLight1.lookAt(plane.position);
  areaLight2 = new THREEFLOW.AreaLight({
    color: 0x8888ff,
    radiance: 10,
    simulate: false,
    geometry: lightGeom
  });
  areaLight2.position.set(75, 100, -75);
  areaLight2.lookAt(plane.position);
  scene.add(camera);
  scene.add(plane);
  scene.add(ambientLight);
  scene.add(areaLight1);
  scene.add(areaLight2);
  simplex = new SimplexNoise();
  simplexSmooth = .05;
  size = 5;
  gridX = 40;
  gridZ = 40;
  scale = 5;
  offset = new THREE.Vector3(-(gridX * size) / 2, 0, -(gridZ * size) / 2);
  geometry = new THREE.CubeGeometry(size, size, size);
  material = new THREEFLOW.DiffuseMaterial({
    color: 0xffffff,
    wireframe: true
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
  camera.position.set(170, 170, 170);
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
