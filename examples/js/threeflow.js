(function() {
  var BlockExporter, CameraExporter, CausticsExporter, ConstantMaterial, DiffuseMaterial, Exporter, GeometryExporter, GiExporter, GlassMaterial, ImageExporter, LightsExporter, MaterialsExporter, MeshExporter, MirrorMaterial, PhongMaterial, PointLight, ShinyMaterial, SunflowRenderer, SunskyLight, TraceDepthsExporter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.THREEFLOW = window.THREEFLOW || {};

  THREEFLOW.SunflowRenderer = SunflowRenderer = (function() {
    function SunflowRenderer(options) {
      this.onRenderComplete = __bind(this.onRenderComplete, this);
      this.onRenderProgress = __bind(this.onRenderProgress, this);
      this.onRenderStart = __bind(this.onRenderStart, this);
      this.onConnected = __bind(this.onConnected, this);
      options = options || {};
      this.port = options.port || 3000;
      this.host = options.host || "http://localhost";
      this.exporter = new Exporter();
      this.image = this.exporter.image;
      this.traceDepths = this.exporter.traceDepths;
      this.caustics = this.exporter.caustics;
      this.gi = this.exporter.gi;
      this.cameras = this.exporter.cameras;
      this.lights = this.exporter.lights;
      this.materials = this.exporter.materials;
      this.geometry = this.exporter.geometry;
      this.meshes = this.exporter.meshes;
      this.connected = false;
      this.rendering = false;
    }

    SunflowRenderer.prototype.connect = function() {
      if (this.connected) {
        return;
      }
      this.socket = io.connect(this.host);
      this.socket.on('connected', this.onConnected);
      this.socket.on('renderstart', this.onRenderStart);
      this.socket.on('renderprogress', this.onRenderProgress);
      this.socket.on('rendercomplete', this.onRenderComplete);
      return null;
    };

    SunflowRenderer.prototype.render = function(scene, camera, width, height) {
      var scContents, scale;
      if (!this.connected) {
        throw new Error("[SunflowRenderer] Call connect() before rendering.");
      } else if (!this.rendering) {
        console.log("RENDER");
        scale = 1;
        this.exporter.image.resolutionX = width * scale;
        this.exporter.image.resolutionY = height * scale;
        this.exporter.indexScene(scene);
        scContents = this.exporter.exportCode();
        this.socket.emit("render", {
          scFile: scContents
        });
      } else {
        console.log("QUEUE?");
      }
      return null;
    };

    SunflowRenderer.prototype.onConnected = function(data) {
      console.log("Sunflow conected.");
      this.connected = true;
      return null;
    };

    SunflowRenderer.prototype.onRenderStart = function(data) {
      console.log("onRenderStart");
      return null;
    };

    SunflowRenderer.prototype.onRenderProgress = function(data) {
      console.log("onRenderProgress");
      return null;
    };

    SunflowRenderer.prototype.onRenderComplete = function(data) {
      console.log("onRenderComplete");
      return null;
    };

    return SunflowRenderer;

  })();

  BlockExporter = (function() {
    function BlockExporter() {}

    BlockExporter.prototype.addToIndex = function(object3d) {
      throw new Error('BlockExporter subclasses must override this method.');
    };

    BlockExporter.prototype.doTraverse = function(object3d) {
      throw new Error('BlockExporter subclasses must override this method.');
    };

    BlockExporter.prototype.exportBlock = function() {
      throw new Error('BlockExporter subclasses must override this method.');
    };

    BlockExporter.prototype.exportColorTHREE = function(color) {
      return '{ "sRGB nonlinear" ' + color.r + ' ' + color.g + ' ' + color.b + ' }';
    };

    BlockExporter.prototype.exportColorHex = function(hex) {
      var b, g, r;
      r = (hex >> 16 & 0xff) / 255;
      g = (hex >> 8 & 0xff) / 255;
      b = (hex & 0xff) / 255;
      return '{ "sRGB nonlinear" ' + r + ' ' + g + ' ' + b + ' }';
    };

    BlockExporter.prototype.exportVector = function(vector) {
      return vector.x + " " + vector.y + " " + vector.z;
    };

    BlockExporter.prototype.exportFace = function(face) {
      return face.a + " " + face.b + " " + face.c;
    };

    BlockExporter.prototype.exportTransform = function(object3d) {
      var element, result, _i, _len, _ref;
      result = '';
      _ref = object3d.matrixWorld.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        result += ' ' + element;
      }
      return result;
    };

    BlockExporter.prototype.exportTransformPosition = function(object3d) {
      var elements, result;
      result = '';
      elements = object3d.matrixWorld.elements;
      result += elements[12] + ' ' + elements[13] + ' ' + elements[14];
      return result;
    };

    return BlockExporter;

  })();

  CameraExporter = (function(_super) {
    __extends(CameraExporter, _super);

    function CameraExporter() {
      CameraExporter.__super__.constructor.call(this);
      this.camera = null;
    }

    CameraExporter.prototype.addToIndex = function(object3d) {
      if (this.camera) {
        return;
      }
      if (object3d instanceof THREE.PerspectiveCamera) {
        this.camera = object3d;
        console.log("SET CAMERA", this.camera);
      }
      return null;
    };

    CameraExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    CameraExporter.prototype.exportBlock = function() {
      var result;
      result = '';
      if (!this.camera) {
        return result;
      }
      result += 'camera {\n';
      result += '  type pinhole\n';
      result += '  eye ' + this.exportVector(this.camera.position) + '\n';
      result += '  target ' + this.exportVector(this.camera.rotation) + '\n';
      result += '  up ' + this.exportVector(this.camera.up) + '\n';
      result += '  fov ' + this.camera.fov * this.camera.aspect + '\n';
      result += '  aspect ' + this.camera.aspect + '\n';
      result += '}\n\n';
      return result;
    };

    return CameraExporter;

  })(BlockExporter);

  CausticsExporter = (function(_super) {
    __extends(CausticsExporter, _super);

    function CausticsExporter() {
      CausticsExporter.__super__.constructor.call(this);
      this.enabled = false;
      this.photons = 10000;
      this.kdEstimate = 100;
      this.kdRadius = 0.5;
    }

    CausticsExporter.prototype.addToIndex = function(object3d) {
      return null;
    };

    CausticsExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    CausticsExporter.prototype.exportBlock = function() {
      var result;
      result = '';
      if (!this.enabled) {
        return result;
      }
      result += 'photons {\n';
      result += '  caustics ' + this.photons + ' kd ' + this.kdEstimate + ' ' + this.kdRadius + '\n';
      result += '}\n\n';
      return result;
    };

    return CausticsExporter;

  })(BlockExporter);

  Exporter = (function() {
    Exporter.BUCKET_ORDERS = ['hilbert', 'spiral', 'column', 'row', 'diagonal', 'random'];

    /*
        bucketSize: 48
        bucketOrder: ImageExporter.BUCKET_ORDERS[0]
        bucketOrderReverse: false
    
      # format bucket options.
      bucket = @settings.bucketSize + ' '
      if @settings.bucketOrderReverse
        bucket += '"reverse ' + @settings.bucketOrder + '"'
      else
        bucket += @settings.bucketOrder
    
      result += '  bucket ' + bucket + '\n'
    */


    function Exporter() {
      this.exporterSettings = {
        convertPrimitives: false
      };
      this.blockExporters = [];
      this.image = this.addBlockExporter(new ImageExporter());
      this.traceDepths = this.addBlockExporter(new TraceDepthsExporter());
      this.caustics = this.addBlockExporter(new CausticsExporter());
      this.gi = this.addBlockExporter(new GiExporter());
      this.cameras = this.addBlockExporter(new CameraExporter());
      this.lights = this.addBlockExporter(new LightsExporter());
      this.materials = this.addBlockExporter(new MaterialsExporter());
      this.geometry = this.addBlockExporter(new GeometryExporter());
      this.meshes = this.addBlockExporter(new MeshExporter());
    }

    Exporter.prototype.addBlockExporter = function(exporter) {
      if (!exporter instanceof BlockExporter) {
        throw new Error('Extend BlockExporter');
      } else {
        this.blockExporters.push(exporter);
      }
      return exporter;
    };

    Exporter.prototype.indexScene = function(object3d) {
      var blockExporter, child, doTraverse, _i, _j, _len, _len1, _ref, _ref1;
      if (object3d.children.length) {
        _ref = object3d.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          doTraverse = true;
          _ref1 = this.blockExporters;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            blockExporter = _ref1[_j];
            blockExporter.addToIndex(child);
            doTraverse = doTraverse && blockExporter.doTraverse(child);
          }
          if (doTraverse) {
            this.indexScene(child);
          }
        }
      }
      return null;
    };

    Exporter.prototype.exportCode = function() {
      var blockExporter, result, _i, _len, _ref;
      result = '';
      _ref = this.blockExporters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        blockExporter = _ref[_i];
        result += blockExporter.exportBlock();
      }
      return result;
    };

    return Exporter;

  })();

  GeometryExporter = (function(_super) {
    __extends(GeometryExporter, _super);

    function GeometryExporter() {
      GeometryExporter.__super__.constructor.call(this);
      this.geometryIndex = {};
    }

    GeometryExporter.prototype.addToIndex = function(object3d) {
      if (object3d instanceof THREE.Mesh) {
        if (object3d.geometry && !this.geometryIndex[object3d.geometry.uuid]) {
          this.geometryIndex[object3d.geometry.uuid] = object3d.geometry;
        }
      }
      return null;
    };

    GeometryExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    GeometryExporter.prototype.exportBlock = function() {
      var face, geometry, result, uuid, vertex, _i, _j, _len, _len1, _ref, _ref1;
      result = '';
      for (uuid in this.geometryIndex) {
        geometry = this.geometryIndex[uuid];
        result += 'object {\n';
        result += '  noinstance\n';
        result += '  type generic-mesh\n';
        result += '  name ' + geometry.uuid + '\n';
        result += '  points ' + geometry.vertices.length + '\n';
        _ref = geometry.vertices;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          vertex = _ref[_i];
          result += '    ' + this.exportVector(vertex) + '\n';
        }
        result += '  triangles ' + geometry.faces.length + '\n';
        _ref1 = geometry.faces;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          face = _ref1[_j];
          result += '    ' + this.exportFace(face) + '\n';
        }
        result += '  normals none\n';
        result += '  uvs none\n';
        result += '}\n\n';
      }
      return result;
    };

    return GeometryExporter;

  })(BlockExporter);

  GiExporter = (function(_super) {
    __extends(GiExporter, _super);

    GiExporter.GLOBAL_MAP_TYPES = ['grid', 'path'];

    GiExporter.TYPES = ['igi', 'irr-cache', 'path', 'ambocc', 'fake'];

    function GiExporter() {
      this.type = GiExporter.TYPES[0];
      this.enabled = false;
      this.globalMapTypes = GiExporter.GLOBAL_MAP_TYPES;
      this.types = GiExporter.TYPES;
      this.irrCache = {
        samples: 512,
        tolerance: 0.01,
        spacingMin: 0.05,
        spacingMax: 5.0,
        globalEnabled: false,
        globalPhotons: 10000,
        globalMap: GiExporter.GLOBAL_MAP_TYPES[0],
        globalEstimate: 100,
        globalRadius: 0.75
      };
      this.igi = {
        samples: 64,
        sets: 1,
        bias: 0.01,
        biasSamples: 0
      };
      this.path = {
        samples: 32
      };
      this.ambOcc = {
        samples: 32,
        bright: 0xffffff,
        dark: 0x000000,
        maxDistance: 3.0
      };
      this.fake = {
        up: new THREE.Vector3(0, 1, 0),
        sky: 0x000000,
        ground: 0xffffff
      };
    }

    GiExporter.prototype.addToIndex = function(object3d) {
      return null;
    };

    GiExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    GiExporter.prototype.exportBlock = function() {
      var global, result;
      result = '';
      if (!this.enabled) {
        return result;
      }
      result += 'gi {\n';
      result += '  type ' + this.type + '\n';
      if (this.type === 'igi') {
        result += '  samples ' + this.igi.samples + '\n';
        result += '  sets ' + this.igi.sets + '\n';
        result += '  b ' + this.igi.bias + '\n';
        result += '  bias-samples ' + this.igi.biasSamples + '\n';
      } else if (this.type === 'irr-cache') {
        result += '  samples ' + this.irrCache.samples + '\n';
        result += '  tolerance ' + this.irrCache.tolerance + '\n';
        result += '  spacing ' + this.irrCache.spacingMin + ' ' + this.irrCache.spacingMax + '\n';
        if (this.irrCache.globalEnabled) {
          global = '  global ';
          global += this.irrCache.globalPhotons + ' ';
          global += this.irrCache.globalMap + ' ';
          global += this.irrCache.globalEstimate + ' ';
          global += this.irrCache.globalRadius + '\n';
          result += global;
        }
      } else if (this.type === 'path') {
        result += 'samples ' + this.path.samples + '\n';
      } else if (this.type === 'ambocc') {
        result += '  bright { "sRGB nonlinear" 1 1 1 }' + '\n';
        result += '  dark { "sRGB nonlinear" 0 0 0 }' + '\n';
        result += '  samples ' + this.ambOcc.samples + '\n';
        result += '  maxdist ' + this.ambOcc.maxDistance + '\n';
      } else if (this.type === 'fake') {
        result += '  up ' + this.exportVector(this.fake.up + '\n');
        result += '  sky { "sRGB nonlinear" 0 0 0 }' + '\n';
        result += '  ground { "sRGB nonlinear" 1 1 1 }' + '\n';
      }
      result += '}\n\n';
      return result;
    };

    return GiExporter;

  })(BlockExporter);

  ImageExporter = (function(_super) {
    __extends(ImageExporter, _super);

    ImageExporter.FILTERS = ['box', 'triangle', 'gaussian', 'mitchell', 'catmull-rom', 'blackman-harris', 'sinc', 'lanczos', 'ospline'];

    function ImageExporter() {
      ImageExporter.__super__.constructor.call(this);
      this.resolutionX = 800;
      this.resolutionY = 600;
      this.antialiasMin = -1;
      this.antialiasMax = 1;
      this.samples = 2;
      this.contrast = 0.1;
      this.filter = ImageExporter.FILTERS[0];
      this.jitter = true;
      this.filterTypes = ImageExporter.FILTERS;
    }

    ImageExporter.prototype.addToIndex = function(object3d) {
      return null;
    };

    ImageExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    ImageExporter.prototype.exportBlock = function() {
      var result;
      result = '';
      result += 'image {\n';
      result += '  resolution ' + this.resolutionX + ' ' + this.resolutionY + '\n';
      result += '  aa ' + this.antialiasMin + ' ' + this.antialiasMax + '\n';
      result += '  samples ' + this.samples + '\n';
      result += '  contrast ' + this.contrast + '\n';
      result += '  filter ' + this.filter + '\n';
      result += '  jitter ' + this.jitter + '\n';
      result += '}\n\n';
      return result;
    };

    return ImageExporter;

  })(BlockExporter);

  LightsExporter = (function(_super) {
    __extends(LightsExporter, _super);

    function LightsExporter() {
      LightsExporter.__super__.constructor.call(this);
      this.lightIndex = {};
    }

    LightsExporter.prototype.addToIndex = function(object3d) {
      if (object3d instanceof THREEFLOW.PointLight && !this.lightIndex[object3d.uuid]) {
        this.lightIndex[object3d.uuid] = object3d;
      } else if (object3d instanceof THREEFLOW.SunskyLight && !this.lightIndex[object3d.uuid]) {
        this.lightIndex[object3d.uuid] = object3d;
      }
      return null;
    };

    LightsExporter.prototype.doTraverse = function(object3d) {
      return !((object3d instanceof THREEFLOW.PointLight) || (object3d instanceof THREEFLOW.SunskyLight));
    };

    LightsExporter.prototype.exportBlock = function() {
      var light, result, uuid;
      result = '';
      for (uuid in this.lightIndex) {
        light = this.lightIndex[uuid];
        if (light instanceof THREEFLOW.SunskyLight) {
          result += 'light {\n';
          result += '  type sunsky\n';
          result += '  up ' + this.exportVector(light.up) + '\n';
          result += '  east ' + this.exportVector(light.east) + '\n';
          result += '  sundir ' + this.exportVector(light.direction) + '\n';
          result += '  turbidity ' + light.turbidity + '\n';
          result += '  samples ' + light.samples + '\n';
          result += '}\n\n';
        } else if (light instanceof THREEFLOW.PointLight) {
          result += 'light {\n';
          result += '  type point\n';
          result += '  color ' + this.exportColorTHREE(light.color) + '\n';
          result += '  power ' + light.intensity * 200 + ' \n';
          result += '  p ' + this.exportVector(light.position) + '\n';
          result += '}\n\n';
        }
      }
      return result;
    };

    return LightsExporter;

  })(BlockExporter);

  MaterialsExporter = (function(_super) {
    __extends(MaterialsExporter, _super);

    function MaterialsExporter() {
      MaterialsExporter.__super__.constructor.call(this);
      this.materialsIndex = {};
    }

    MaterialsExporter.prototype.addToIndex = function(object3d) {
      if (object3d instanceof THREE.Mesh) {
        if (object3d.material && !this.materialsIndex[object3d.material.uuid]) {
          this.materialsIndex[object3d.material.uuid] = object3d.material;
        }
      }
      return null;
    };

    MaterialsExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    MaterialsExporter.prototype.exportBlock = function() {
      var material, result, uuid;
      result = '';
      for (uuid in this.materialsIndex) {
        material = this.materialsIndex[uuid];
        result += 'shader {\n';
        result += '  name ' + material.uuid + '\n';
        if (material instanceof THREEFLOW.ConstantMaterial || material instanceof THREE.MeshBasicMaterial) {
          result += '  type constant\n';
          result += '  color ' + this.exportColorTHREE(material.color) + '\n';
        } else if (material instanceof THREEFLOW.DiffuseMaterial || material instanceof THREE.MeshLambertMaterial) {
          result += '  type diffuse\n';
          result += '  diff ' + this.exportColorTHREE(material.color) + '\n';
        } else if (material instanceof THREEFLOW.ShinyMaterial) {
          result += '  type shiny\n';
          result += '  diff ' + this.exportColorTHREE(material.color) + '\n';
          result += '  refl ' + material.reflection + '\n';
        } else if (material instanceof THREEFLOW.GlassMaterial) {
          result += '  type glass\n';
          result += '  eta ' + material.eta + '\n';
          result += '  color ' + this.exportColorTHREE(material.color) + '\n';
        } else if (material instanceof THREEFLOW.MirrorMaterial) {
          result += '  type mirror\n';
          result += '  refl ' + this.exportColorTHREE(material.reflection) + '\n';
        } else if (material instanceof THREEFLOW.PhongMaterial || material instanceof THREE.MeshPhongMaterial) {
          result += '  type phong\n';
          result += '  diff ' + this.exportColorTHREE(material.color) + '\n';
          result += '  spec ' + this.exportColorTHREE(material.specular) + ' ' + material.shininess + '\n';
          result += '  samples ' + (material.samples || 4) + '\n';
        }
        result += '}\n\n';
      }
      return result;
    };

    return MaterialsExporter;

  })(BlockExporter);

  MeshExporter = (function(_super) {
    __extends(MeshExporter, _super);

    function MeshExporter() {
      MeshExporter.__super__.constructor.call(this);
      this.convertPrimitives = true;
      this.meshIndex = {};
    }

    MeshExporter.prototype.addToIndex = function(object3d) {
      if (object3d instanceof THREE.Mesh && !this.meshIndex[object3d.uuid]) {
        this.meshIndex[object3d.uuid] = object3d;
      }
      return null;
    };

    MeshExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    MeshExporter.prototype.exportBlock = function() {
      var mesh, result, uuid;
      result = '';
      for (uuid in this.meshIndex) {
        mesh = this.meshIndex[uuid];
        if (mesh.geometry instanceof THREEFLOW.InfinitePlaneGeometry) {
          result += 'object {\n';
          result += '  shader ' + mesh.material.uuid + '\n';
          result += '  type plane\n';
          result += '  p ' + this.exportTransformPosition(mesh) + '\n';
          result += '  n ' + this.exportVector(mesh.up) + '\n';
        } else if (this.convertPrimitives && mesh.geometry instanceof THREE.SphereGeometry) {
          result += 'object {\n';
          result += '  shader ' + mesh.material.uuid + '\n';
          result += '  type sphere\n';
          result += '  name ' + mesh.uuid + '\n';
          result += '  c ' + this.exportTransformPosition(mesh) + '\n';
          result += '  r ' + mesh.geometry.radius + '\n';
        } else {
          result += 'instance {\n';
          result += '  name ' + mesh.uuid + '\n';
          result += '  geometry ' + mesh.geometry.uuid + '\n';
          result += '  transform col' + this.exportTransform(mesh) + '\n';
          result += '  shader ' + mesh.material.uuid + '\n';
        }
        result += '}\n\n';
      }
      return result;
    };

    return MeshExporter;

  })(BlockExporter);

  TraceDepthsExporter = (function(_super) {
    __extends(TraceDepthsExporter, _super);

    function TraceDepthsExporter() {
      TraceDepthsExporter.__super__.constructor.call(this);
      this.enabled = false;
      this.diffusion = 1;
      this.reflection = 4;
      this.refraction = 4;
    }

    TraceDepthsExporter.prototype.addToIndex = function(object3d) {
      return null;
    };

    TraceDepthsExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    TraceDepthsExporter.prototype.exportBlock = function() {
      var result;
      result = '';
      if (!this.enabled) {
        return result;
      }
      result += 'trace-depths {\n';
      result += '  diff ' + this.diffusion + '\n';
      result += '  refl ' + this.reflection + '\n';
      result += '  refr ' + this.refraction + '\n';
      result += '}\n\n';
      return result;
    };

    return TraceDepthsExporter;

  })(BlockExporter);

  THREEFLOW.InfinitePlaneGeometry = function(width, height, widthSegments, heightSegments) {
    var face, matrix, normal, _i, _len, _ref;
    width = width || 1000;
    height = height || 1000;
    widthSegments = widthSegments || 10;
    heightSegments = heightSegments || 10;
    THREE.PlaneGeometry.call(this, width, height, widthSegments, heightSegments);
    matrix = new THREE.Matrix4();
    matrix.makeRotationX(Math.PI / 2);
    this.applyMatrix(matrix);
    normal = new THREE.Vector3(0, 1, 0);
    _ref = this.faces;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      face = _ref[_i];
      face.normal.copy(normal);
      face.vertexNormals[0].copy(normal);
      face.vertexNormals[1].copy(normal);
      face.vertexNormals[2].copy(normal);
    }
    return this.computeCentroids();
  };

  THREEFLOW.InfinitePlaneGeometry.prototype = Object.create(THREE.PlaneGeometry.prototype);

  THREEFLOW.PointLight = PointLight = (function(_super) {
    __extends(PointLight, _super);

    function PointLight(hex, intensity, distance) {
      var geometry, material;
      PointLight.__super__.constructor.call(this, hex, intensity, distance);
      THREE.PointLight.call(this);
      geometry = new THREE.SphereGeometry(6, 3, 3);
      material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        wireframe: true
      });
      this.mesh = new THREE.Mesh(geometry, material);
      this.add(this.mesh);
    }

    return PointLight;

  })(THREE.PointLight);

  THREEFLOW.SunskyLight = SunskyLight = (function(_super) {
    __extends(SunskyLight, _super);

    function SunskyLight(params) {
      SunskyLight.__super__.constructor.call(this);
      params = params || {};
      this.up = params.up || new THREE.Vector3(0, 1, 0);
      this.east = params.east || new THREE.Vector3(0, 0, 1);
      this.direction = params.direction || new THREE.Vector3(1, 1, 1);
      this.turbidity = params.turbidity || 2;
      this.samples = params.samples || 32;
      if (params.previewLights !== false) {
        params.previewLights = true;
      }
      if (params.dirLight !== false) {
        params.dirLight = true;
      }
      if (params.hemLight !== false) {
        params.hemLight = true;
      }
      if (params.previewLights) {
        if (params.dirLight) {
          console.log("ADD DIR LIGHT");
          this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
          this.add(this.dirLight);
        }
        if (params.hemLight) {
          this.hemLight = new THREE.HemisphereLight(0xffffff, 0x333333, .8);
          this.add(this.hemLight);
        }
      }
    }

    return SunskyLight;

  })(THREE.Object3D);

  THREEFLOW.ConstantMaterial = ConstantMaterial = (function(_super) {
    __extends(ConstantMaterial, _super);

    function ConstantMaterial(parameters) {
      ConstantMaterial.__super__.constructor.call(this);
      THREE.MeshPhongMaterial.call(this);
      this.setValues(parameters);
    }

    return ConstantMaterial;

  })(THREE.MeshPhongMaterial);

  THREEFLOW.DiffuseMaterial = DiffuseMaterial = (function(_super) {
    __extends(DiffuseMaterial, _super);

    function DiffuseMaterial(parameters) {
      DiffuseMaterial.__super__.constructor.call(this);
      THREE.MeshLambertMaterial.call(this);
      this.setValues(parameters);
    }

    return DiffuseMaterial;

  })(THREE.MeshLambertMaterial);

  THREEFLOW.GlassMaterial = GlassMaterial = (function(_super) {
    __extends(GlassMaterial, _super);

    function GlassMaterial(parameters) {
      GlassMaterial.__super__.constructor.call(this);
      parameters = parameters || {};
      this.eta = parameters.eta || 1.0;
      this.absorptionDistance = parameters.absorptionDistance || 5.0;
      if (typeof parameters.absorptionColor === THREE.Color) {
        this.absorptionColor = parameters.absorptionColor;
      } else if (typeof parameters.absorptionColor === 'number') {
        this.absorptionColor = new THREE.Color(parameters.absorptionColor);
      } else {
        this.absorptionColor = new THREE.Color(0xffffff);
      }
      THREE.MeshPhongMaterial.call(this);
      this.setValues(parameters);
    }

    return GlassMaterial;

  })(THREE.MeshPhongMaterial);

  THREEFLOW.MirrorMaterial = MirrorMaterial = (function(_super) {
    __extends(MirrorMaterial, _super);

    function MirrorMaterial(parameters) {
      MirrorMaterial.__super__.constructor.call(this);
      parameters = parameters || {};
      if (typeof parameters.reflection === THREE.Color) {
        this.reflection = parameters.reflection;
      } else if (typeof parameters.reflection === 'number') {
        this.reflection = new THREE.Color(parameters.reflection);
      } else {
        this.reflection = new THREE.Color(0xffffff);
      }
      THREE.MeshPhongMaterial.call(this);
      this.setValues(parameters);
    }

    return MirrorMaterial;

  })(THREE.MeshPhongMaterial);

  THREEFLOW.PhongMaterial = PhongMaterial = (function(_super) {
    __extends(PhongMaterial, _super);

    function PhongMaterial(parameters) {
      PhongMaterial.__super__.constructor.call(this);
      parameters = parameters || {};
      this.samples = parameters.samples || 4;
      THREE.MeshPhongMaterial.call(this);
      this.setValues(parameters);
    }

    return PhongMaterial;

  })(THREE.MeshPhongMaterial);

  THREEFLOW.ShinyMaterial = ShinyMaterial = (function(_super) {
    __extends(ShinyMaterial, _super);

    function ShinyMaterial(parameters) {
      ShinyMaterial.__super__.constructor.call(this);
      parameters = parameters || {};
      this.reflection = parameters.reflection || 0.5;
      THREE.MeshPhongMaterial.call(this);
      this.setValues(parameters);
    }

    return ShinyMaterial;

  })(THREE.MeshPhongMaterial);

}).call(this);
