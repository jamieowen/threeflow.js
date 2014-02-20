window.onload = function() {
  var ab, ax, ay, az, b_y, box, bx, bz, camera, cb, color, colors, controls, cx, cy, cz, d, d2, geometry, greenLight, gui, height, hemLight, i, lightGeom, material, n, n2, normals, nx, ny, nz, object, pA, pB, pC, plane, positions, redLight, render, scene, threeflow, triangles, vx, vy, vz, webgl, whiteLight, width, x, y, z, _i, _ref,
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
    scaleY: 0.5,
    size: 400
  });
  scene.add(box);
  scene.add(camera);
  scene.add(plane);
  triangles = 1000;
  geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', Float32Array, triangles * 3, 3);
  geometry.addAttribute('normal', Float32Array, triangles * 3, 3);
  geometry.addAttribute('color', Float32Array, triangles * 3, 3);
  positions = geometry.attributes.position.array;
  normals = geometry.attributes.normal.array;
  colors = geometry.attributes.color.array;
  color = new THREE.Color();
  n = 40;
  n2 = n / 2;
  d = 5;
  d2 = d / 2;
  pA = new THREE.Vector3();
  pB = new THREE.Vector3();
  pC = new THREE.Vector3();
  cb = new THREE.Vector3();
  ab = new THREE.Vector3();
  for (i = _i = 0, _ref = positions.length; _i < _ref; i = _i += 9) {
    x = Math.random() * n - n2;
    y = Math.random() * n - n2;
    z = Math.random() * n - n2;
    ax = x + Math.random() * d - d2;
    ay = y + Math.random() * d - d2;
    az = z + Math.random() * d - d2;
    bx = x + Math.random() * d - d2;
    b_y = y + Math.random() * d - d2;
    bz = z + Math.random() * d - d2;
    cx = x + Math.random() * d - d2;
    cy = y + Math.random() * d - d2;
    cz = z + Math.random() * d - d2;
    positions[i] = ax;
    positions[i + 1] = ay;
    positions[i + 2] = az;
    positions[i + 3] = bx;
    positions[i + 4] = b_y;
    positions[i + 5] = bz;
    positions[i + 6] = cx;
    positions[i + 7] = cy;
    positions[i + 8] = cz;
    pA.set(ax, ay, az);
    pB.set(bx, b_y, bz);
    pC.set(cx, cy, cz);
    cb.subVectors(pC, pB);
    ab.subVectors(pA, pB);
    cb.cross(ab);
    cb.normalize();
    nx = cb.x;
    ny = cb.y;
    nz = cb.z;
    normals[i] = nx;
    normals[i + 1] = ny;
    normals[i + 2] = nz;
    normals[i + 3] = nx;
    normals[i + 4] = ny;
    normals[i + 5] = nz;
    normals[i + 6] = nx;
    normals[i + 7] = ny;
    normals[i + 8] = nz;
    vx = (x / n) + 0.5;
    vy = (y / n) + 0.5;
    vz = (z / n) + 0.5;
    color.setRGB(vx, vy, vz);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
    colors[i + 3] = color.r;
    colors[i + 4] = color.g;
    colors[i + 5] = color.b;
    colors[i + 6] = color.r;
    colors[i + 7] = color.g;
    colors[i + 8] = color.b;
  }
  geometry.computeBoundingSphere();
  material = new THREEFLOW.MirrorMaterial({
    color: 0x665599,
    reflection: 0xffffff,
    wireframe: true
  });
  material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    ambient: 0xaaaaaa,
    specular: 0xffffff,
    shininess: 250,
    side: THREE.DoubleSide,
    vertexColors: THREE.VertexColors
  });
  object = new THREE.Mesh(geometry, material);
  scene.add(object);
  camera.position.set(70, 50, 80);
  object.position.y = n;
  controls.target = object.position;
  hemLight = new THREE.HemisphereLight();
  scene.add(hemLight);
  lightGeom = new THREE.PlaneGeometry(30, 30);
  redLight = new THREEFLOW.AreaLight({
    color: 0xff9999,
    radiance: 20,
    intensity: 3,
    simulate: false,
    geometry: lightGeom
  });
  redLight.position.set(60, 70, -50);
  redLight.lookAt(object.position);
  scene.add(redLight);
  greenLight = new THREEFLOW.AreaLight({
    color: 0x99ff99,
    radiance: 14,
    intensity: 3,
    simulate: false,
    geometry: lightGeom
  });
  greenLight.position.set(-80, 50, 50);
  greenLight.lookAt(object.position);
  scene.add(greenLight);
  whiteLight = new THREEFLOW.AreaLight({
    color: 0xffffff,
    radiance: 10,
    intensity: 3,
    simulate: false,
    geometry: lightGeom
  });
  whiteLight.position.set(0, 20, 90);
  whiteLight.lookAt(object.position);
  scene.add(whiteLight);
  threeflow = new THREEFLOW.SunflowRenderer({
    pngPath: "examples/renders/geometry_buffer.png",
    scPath: "examples/renders/geometry_buffer.sc"
  });
  threeflow.connect();
  threeflow.image.filter = "mitchell";
  threeflow.image.antialiasMin = 1;
  threeflow.image.antialiasMax = 2;
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
