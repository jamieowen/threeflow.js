window.onload = function() {
  var ambient, camera, controls, count, geom, height, i, loader, material, mesh, radius, render, renderGui, rig, scene, size, spheres, theta, threeflow, webgl, width, _i,
    _this = this;
  webgl = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById("canvas")
  });
  width = webgl.domElement.width;
  height = webgl.domElement.height;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, width / height, 1, 100000);
  controls = new THREE.OrbitControls(camera, webgl.domElement);
  ambient = new THREE.AmbientLight(0x333333);
  scene.add(ambient);
  rig = new THREEFLOW.LightingRig();
  scene.add(rig);
  scene.add(camera);
  size = 30;
  geom = new THREE.SphereGeometry(size, size);
  geom.computeBoundingBox();
  count = 16;
  radius = ((size * 2) * (count + 4)) / (Math.PI * 2);
  spheres = new THREE.Object3D();
  for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
    material = new THREEFLOW.ShinyMaterial();
    material.color.setHSL(i / count, .7, .5);
    mesh = new THREE.Mesh(geom, material);
    theta = ((Math.PI * 2) / count) * i;
    mesh.position.x = radius * Math.cos(theta);
    mesh.position.y = -geom.boundingBox.min.y;
    mesh.position.z = radius * Math.sin(theta);
    spheres.add(mesh);
  }
  spheres.rotation.y = Math.PI / 2;
  scene.add(spheres);
  loader = new THREE.JSONLoader();
  loader.load("models/suzanne.json", function(geometry) {
    var scale, subdiv;
    subdiv = new THREE.SubdivisionModifier(2);
    subdiv.modify(geometry);
    geometry.computeBoundingBox();
    material = new THREEFLOW.ShinyMaterial();
    mesh = new THREE.Mesh(geometry, material);
    scale = 200 / (geometry.boundingBox.max.y - geometry.boundingBox.min.y);
    mesh.scale.set(scale, scale, scale);
    mesh.position.y = (geometry.boundingBox.max.y * 0.535) * scale;
    mesh.rotation.order = "YXZ";
    mesh.rotation.x = -(Math.PI / 5);
    mesh.rotation.y = Math.PI / 4;
    return scene.add(mesh);
  });
  camera.position.set(0, 400, 2000);
  threeflow = new THREEFLOW.SunflowRenderer({
    pngPath: "examples/renders/extras_lighting_rig.png",
    scPath: "examples/renders/extras_lighting_rig.sc"
  });
  threeflow.connect();
  renderGui = new THREEFLOW.RendererGui(threeflow);
  renderGui.onRender = function() {
    return threeflow.render(scene, camera, width, height);
  };
  new THREEFLOW.LightingRigGui(rig);
  render = function() {
    controls.update();
    rig.update();
    webgl.render(scene, camera);
    requestAnimationFrame(render);
    return null;
  };
  render();
  return null;
};
