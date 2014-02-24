window.onload = function() {
  var box, camera, controls, geometry, greenLight, gui, height, material, object, plane, redLight, render, scene, threeflow, webgl, whiteLight, width,
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
  plane = new THREE.Mesh(new THREEFLOW.InfinitePlaneGeometry(), new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wireframe: true
  }));
  box = new THREEFLOW.LightingBox({
    scaleY: 0.3,
    size: 200
  });
  scene.add(box);
  scene.add(camera);
  scene.add(plane);
  camera.position.set(-20, 10, 30);
  geometry = new THREE.IcosahedronGeometry(5, 2);
  material = new THREEFLOW.MirrorMaterial({
    color: 0x665599,
    reflection: 0xffffff,
    wireframe: true
  });
  object = new THREE.Mesh(geometry, material);
  object.position.set(0, geometry.radius, 0);
  scene.add(object);
  redLight = new THREEFLOW.AreaLight({
    color: 0xff9999,
    radiance: 20,
    intensity: 3
  });
  redLight.position.set(20, 19, -30);
  redLight.lookAt(object.position);
  scene.add(redLight);
  greenLight = new THREEFLOW.AreaLight({
    color: 0x99ff99,
    radiance: 14,
    intensity: 3
  });
  greenLight.position.set(-30, 20, 20);
  greenLight.lookAt(object.position);
  scene.add(greenLight);
  whiteLight = new THREEFLOW.AreaLight({
    color: 0xffffff,
    radiance: 10,
    intensity: 3
  });
  whiteLight.position.set(0, 20, 50);
  whiteLight.lookAt(object.position);
  scene.add(whiteLight);
  threeflow = new THREEFLOW.SunflowRenderer({
    pngPath: "examples/renders/lights_area.png",
    scPath: "examples/renders/lights_area.sc"
  });
  threeflow.connect();
  threeflow.image.filter = "mitchell";
  gui = new THREEFLOW.RendererGui(threeflow);
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
