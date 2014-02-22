window.onload = function() {
  var ambient, camera, controls, geom, gui, height, material, mesh, normals, render, rig, scene, threeflow, webgl, width,
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
  geom = new THREE.SphereGeometry(50, 50);
  material = new THREEFLOW.ShinyMaterial({
    color: 0xff0000
  });
  mesh = new THREE.Mesh(geom, material);
  mesh.position.set(-50, 50, 0);
  scene.add(mesh);
  mesh = new THREE.Mesh(geom, material);
  mesh.position.set(50, 50, 0);
  scene.add(mesh);
  normals = new THREE.VertexNormalsHelper(mesh, 10);
  scene.add(normals);
  scene.add(rig);
  scene.add(camera);
  camera.position.set(0, 0, 4000);
  threeflow = new THREEFLOW.SunflowRenderer({
    pngPath: "examples/renders/extras_lighting_rig.png",
    scPath: "examples/renders/extras_lighting_rig.sc"
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
