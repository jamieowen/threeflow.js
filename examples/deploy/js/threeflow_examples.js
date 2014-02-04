var BasicCameraSetup, DiffuseObjectsSetup, Main, SunSkyLightingSetup,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Main = (function() {
  function Main() {
    this.render = __bind(this.render, this);
    this.onRenderClick = __bind(this.onRenderClick, this);
    this.sunflowRenderer = new THREE.SunflowRenderer();
    this.sunflowRenderer.connect();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height);
    this.objectsSetup = null;
    this.lightingSetup = null;
    this.cameraSetup = null;
    document.getElementById("renderButton").addEventListener("click", this.onRenderClick);
    this.render();
  }

  Main.prototype.onRenderClick = function(event) {
    event.preventDefault();
    console.log("RENDER");
    return this.sunflowRenderer.render(this.scene, this.cameraSetup.getActiveCamera(), this.width, this.height);
  };

  Main.prototype.setObjectsSetup = function(objectsSetup) {
    if (this.objectsSetup) {
      this.objectsSetup.remove(this.scene);
    }
    this.objectsSetup = objectsSetup;
    if (this.objectsSetup) {
      this.objectsSetup.add(this.scene);
    }
    return null;
  };

  Main.prototype.setCameraSetups = function(cameraSetup) {
    if (this.cameraSetup) {
      this.cameraSetup.remove(this.scene);
    }
    this.cameraSetup = cameraSetup;
    if (this.cameraSetup) {
      this.cameraSetup.add(this.scene);
    }
    return null;
  };

  Main.prototype.setLightingSetup = function(lightingSetup) {
    if (this.lightingSetup) {
      this.lightingSetup.remove(this.scene);
    }
    this.lightingSetup = lightingSetup;
    if (this.lightingSetup) {
      this.lightingSetup.add(this.scene);
    }
    return null;
  };

  Main.prototype.render = function() {
    var camera;
    if (this.objectsSetup) {
      this.objectsSetup.update();
    }
    if (this.lightingSetup) {
      this.lightingSetup.update();
    }
    if (this.cameraSetup) {
      this.cameraSetup.update();
      camera = this.cameraSetup.getActiveCamera();
    }
    if (camera) {
      camera.aspect = this.width / this.height;
      this.renderer.render(this.scene, camera);
    }
    requestAnimationFrame(this.render);
    return null;
  };

  return Main;

})();

BasicCameraSetup = (function() {
  function BasicCameraSetup() {
    this.inited = false;
  }

  BasicCameraSetup.prototype.init = function() {
    if (this.inited) {
      return;
    }
    this.inited = true;
    this.camera = new THREE.PerspectiveCamera(35, 800 / 600, 100, 10000);
    this.camera.position.z = -1000;
    this.camera.position.y = 1000;
    this.camera.lookAt(new THREE.Vector3());
    this.controls = new THREE.TrackballControls(this.camera);
    return null;
  };

  BasicCameraSetup.prototype.add = function(scene) {
    this.init();
    scene.add(this.camera);
    return null;
  };

  BasicCameraSetup.prototype.remove = function(scene) {
    scene.remove(this.camera);
    return null;
  };

  BasicCameraSetup.prototype.getActiveCamera = function() {
    return this.camera;
  };

  BasicCameraSetup.prototype.update = function() {
    this.controls.update();
    return null;
  };

  return BasicCameraSetup;

})();

SunSkyLightingSetup = (function() {
  function SunSkyLightingSetup() {
    this.inited = false;
  }

  SunSkyLightingSetup.prototype.init = function() {
    if (this.inited) {
      return;
    }
    this.inited = true;
    this.sunskyLight = new THREE.SF.SunskyLight();
    return null;
  };

  SunSkyLightingSetup.prototype.add = function(scene) {
    this.init();
    scene.add(this.sunskyLight);
    return null;
  };

  SunSkyLightingSetup.prototype.remove = function(scene) {
    scene.remove(this.sunskyLight);
    return null;
  };

  SunSkyLightingSetup.prototype.update = function() {
    return null;
  };

  return SunSkyLightingSetup;

})();

DiffuseObjectsSetup = (function() {
  function DiffuseObjectsSetup() {
    this.inited = false;
  }

  DiffuseObjectsSetup.prototype.init = function() {
    var center, color, i, material, mesh, params, radius, spacing, _i, _j, _len, _len1, _ref, _ref1;
    if (this.inited) {
      return;
    }
    this.inited = true;
    this.sphereGeometry = new THREE.SphereGeometry(98);
    this.sphereCenterGeometry = new THREE.SphereGeometry(250);
    this.colors = [0x52ADCC, 0xADD982, 0xE6F2C2, 0xF1E56C, 0xF37A61, 0x52ADCC, 0xADD982, 0xE6F2C2];
    this.materialParams = [];
    _ref = this.colors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      color = _ref[_i];
      this.materialParams.push({
        color: color,
        wireframe: true
      });
    }
    this.meshes = [];
    this.materials = [];
    spacing = (Math.PI * 2) / this.materialParams.length;
    radius = 350;
    _ref1 = this.materialParams;
    for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
      params = _ref1[i];
      material = new THREE.SF.DiffuseMaterial(params);
      mesh = new THREE.Mesh(this.sphereGeometry, material);
      mesh.position.x = Math.cos(spacing * i) * radius;
      mesh.position.z = Math.sin(spacing * i) * radius;
      mesh.position.y = 50;
      this.meshes.push(mesh);
      this.materials.push(material);
    }
    material = new THREE.SF.MirrorMaterial({
      color: 0xFEFEFE,
      reflection: 0xefefff,
      wireframe: true
    });
    center = new THREE.Mesh(this.sphereCenterGeometry, material);
    center.position.set(0, 250, 0);
    this.meshes.push(center);
    return null;
  };

  DiffuseObjectsSetup.prototype.add = function(scene) {
    var mesh, _i, _len, _ref;
    this.init();
    _ref = this.meshes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      mesh = _ref[_i];
      scene.add(mesh);
    }
    return null;
  };

  DiffuseObjectsSetup.prototype.remove = function(scene) {
    var mesh, _i, _len, _ref;
    _ref = this.meshes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      mesh = _ref[_i];
      scene.remove(mesh);
    }
    return null;
  };

  DiffuseObjectsSetup.prototype.update = function() {
    return null;
  };

  return DiffuseObjectsSetup;

})();
