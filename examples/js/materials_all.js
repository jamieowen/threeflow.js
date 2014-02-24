window.onload = function() {
  var ambientLight, areaLight1, areaLight2, box, camera, controls, geometry, gui, height, i, lightGeom, material, materials, mesh, offset, render, scene, size, spacing, threeflow, webgl, width, _i, _len,
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
  ambientLight = new THREE.HemisphereLight();
  lightGeom = new THREE.PlaneGeometry(30, 30);
  areaLight1 = new THREEFLOW.AreaLight({
    color: 0xff9999,
    radiance: 40,
    simulate: false,
    geometry: lightGeom
  });
  areaLight1.position.set(-100, 70, 100);
  areaLight1.lookAt(new THREE.Vector3());
  areaLight2 = new THREEFLOW.AreaLight({
    color: 0x8888ff,
    radiance: 10,
    simulate: false,
    geometry: lightGeom
  });
  areaLight2.position.set(75, 100, -75);
  areaLight2.lookAt(new THREE.Vector3());
  box = new THREEFLOW.LightingBox({
    size: 500,
    scaleY: .3
  });
  scene.add(camera);
  scene.add(ambientLight);
  scene.add(areaLight1);
  scene.add(areaLight2);
  scene.add(box);
  materials = [
    new THREEFLOW.MirrorMaterial({
      color: 0xffffff,
      reflection: 0xffffff,
      wireframe: true
    }), new THREEFLOW.DiffuseMaterial({
      color: 0xffff00,
      wireframe: true
    }), new THREEFLOW.ConstantMaterial({
      color: 0xffffff,
      wireframe: true
    }), new THREEFLOW.ShinyMaterial({
      color: 0x00ffff,
      reflection: 1,
      wireframe: true
    }), new THREEFLOW.PhongMaterial({
      color: 0x0000ff,
      power: 100,
      wireframe: true
    }), new THREEFLOW.GlassMaterial({
      color: 0xffffff,
      eta: 1.4,
      wireframe: true
    })
  ];
  size = 8;
  spacing = 20;
  offset = (spacing * (materials.length - 1)) / 2;
  geometry = new THREE.SphereGeometry(size);
  for (i = _i = 0, _len = materials.length; _i < _len; i = ++_i) {
    material = materials[i];
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((i * spacing) - offset, size, 0);
    scene.add(mesh);
  }
  camera.position.set(0, 10, 150);
  threeflow = new THREEFLOW.SunflowRenderer({
    pngPath: "examples/renders/materials_all.png",
    scPath: "examples/renders/materials_all.sc"
  });
  threeflow.connect();
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
