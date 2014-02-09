window.onload = function() {
  var ambient, camera, controls, count, geometry, gridX, gridZ, gui, height, ix, iz, light, lightPower, material, offset, plane, plane2, render, scene, simplex, simplexSmooth, size, sphere, threeflow, webgl, width, _i, _j,
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
  ambient = new THREE.AmbientLight(0xffffff);
  plane = new THREE.Mesh(new THREEFLOW.InfinitePlaneGeometry(), new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wireframe: true
  }));
  plane2 = new THREE.Mesh(new THREEFLOW.InfinitePlaneGeometry(), new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wireframe: true
  }));
  scene.add(camera);
  scene.add(ambient);
  scene.add(plane);
  scene.add(plane2);
  camera.position.set(15, 0, -200);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  plane.position.set(0, -20, 0);
  plane2.position.set(0, 20, 0);
  simplex = new SimplexNoise();
  simplexSmooth = .1;
  size = 25;
  gridX = 10;
  gridZ = 10;
  offset = new THREE.Vector3(-(gridX * size) / 2, 0, -(gridZ * size) / 2);
  geometry = new THREE.SphereGeometry(6);
  material = new THREEFLOW.ShinyMaterial({
    wireframe: true,
    color: 0xffffff
  });
  count = 0;
  for (ix = _i = 0; 0 <= gridX ? _i < gridX : _i > gridX; ix = 0 <= gridX ? ++_i : --_i) {
    for (iz = _j = 0; 0 <= gridZ ? _j < gridZ : _j > gridZ; iz = 0 <= gridZ ? ++_j : --_j) {
      light = new THREEFLOW.PointLight();
      lightPower = 700;
      light.position.set(ix * size, simplex.noise(ix * simplexSmooth, iz * simplexSmooth) * 15, iz * size);
      light.position.add(offset);
      sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(light.position);
      light.power = lightPower;
      light.color.setHSL(count++ / (gridX * gridZ), 1, .5);
      light.position.y -= 7;
      scene.add(sphere);
      scene.add(light);
    }
  }
  threeflow = new THREEFLOW.SunflowRenderer({
    pngPath: "examples/renders/lights_point.png"
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
