(function() {
  var BlockExporter, CameraExporter, CausticsExporter, ConstantMaterial, DatGUI, DiffuseMaterial, Exporter, GeometryExporter, GiExporter, GlassMaterial, ImageExporter, LightsExporter, MaterialsExporter, MeshExporter, MirrorMaterial, PhongMaterial, PointLight, ScExporter, ShinyMaterial, SunflowRenderer, SunskyLight, THREE, TraceDepthsExporter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  THREE = window.THREE || {};

  THREE.SF = {};

  THREE.SunflowRenderer = SunflowRenderer = (function() {
    function SunflowRenderer(options) {
      this.onRenderComplete = __bind(this.onRenderComplete, this);
      this.onRenderProgress = __bind(this.onRenderProgress, this);
      this.onRenderStart = __bind(this.onRenderStart, this);
      this.onConnected = __bind(this.onConnected, this);
      options = options || {};
      this.port = options.port || 3000;
      this.host = options.host || "http://localhost";
      this.exporter = new Exporter();
      this.connected = false;
      this.rendering = false;
      this.gui = new DatGUI(this);
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
        this.exporter.blockExporters[0].settings.resolutionX = width * scale;
        this.exporter.blockExporters[0].settings.resolutionY = height * scale;
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
      this.settings = {
        enabled: true
      };
      this.camera = null;
      console.log(this);
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
      if (!this.settings.enabled || !this.camera) {
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
      this.settings = {
        enabled: false,
        photons: 10000,
        kdEstimate: 100,
        kdRadius: 0.5
      };
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
      if (!this.settings.enabled) {
        return result;
      }
      result += 'photons {\n';
      result += '  caustics ' + this.settings.photons + ' kd ' + this.settings.kdEstimate + ' ' + this.settings.kdRadius + '\n';
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
      this.addBlockExporter(new ImageExporter());
      this.addBlockExporter(new TraceDepthsExporter());
      this.addBlockExporter(new CausticsExporter());
      this.addBlockExporter(new GiExporter());
      this.addBlockExporter(new CameraExporter());
      this.addBlockExporter(new LightsExporter());
      this.addBlockExporter(new MaterialsExporter());
      this.addBlockExporter(new GeometryExporter());
      this.addBlockExporter(new MeshExporter());
    }

    Exporter.prototype.addBlockExporter = function(exporter) {
      if (!exporter instanceof BlockExporter) {
        throw new Error('Extend BlockExporter');
      } else {
        return this.blockExporters.push(exporter);
      }
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
      this.settings = {
        enabled: true
      };
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
      if (!this.settings.enabled) {
        return result;
      }
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
      this.irrCacheSettings = {
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
      this.igiSettings = {
        samples: 64,
        sets: 1,
        bias: 0.01,
        biasSamples: 0
      };
      this.pathSettings = {
        samples: 32
      };
      this.ambOccSettings = {
        samples: 32,
        bright: 0xffffff,
        dark: 0x000000,
        maxDistance: 3.0
      };
      this.fakeSettings = {
        upX: 0,
        upY: 1,
        upZ: 0,
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
        result += '  samples ' + this.igiSettings.samples + '\n';
        result += '  sets ' + this.igiSettings.sets + '\n';
        result += '  b ' + this.igiSettings.bias + '\n';
        result += '  bias-samples ' + this.igiSettings.biasSamples + '\n';
      } else if (this.type === 'irr-cache') {
        result += '  samples ' + this.irrCacheSettings.samples + '\n';
        result += '  tolerance ' + this.irrCacheSettings.tolerance + '\n';
        result += '  spacing ' + this.irrCacheSettings.spacingMin + ' ' + this.irrCacheSettings.spacingMax + '\n';
        if (this.irrCacheSettings.globalEnabled) {
          global = 'global ';
          global += this.irrCacheSettings.globalPhotons + ' ';
          global += this.irrCacheSettings.globalMap + ' ';
          global += this.irrCacheSettings.globalEstimate + ' ';
          global += this.irrCacheSettings.globalRadius + '\n';
          result += global;
        }
      } else if (this.type === 'path') {
        result += 'samples ' + this.pathSettings.samples + '\n';
      } else if (this.type === 'ambocc') {
        result += 'bright { "sRGB nonlinear" 1 1 1 }' + '\n';
        result += 'dark { "sRGB nonlinear" 0 0 0 }' + '\n';
        result += 'samples ' + this.ambOccSettings.samples + '\n';
        result += 'maxdist ' + this.ambOccSettings.maxDistance + '\n';
      } else if (this.type === 'fake') {
        result += 'up ' + this.ambOccSettings.upX + ' ' + this.ambOccSettings.upY + ' ' + this.ambOccSettings.upZ;
        result += 'sky { "sRGB nonlinear" 0 0 0 }';
        result += 'ground { "sRGB nonlinear" 1 1 1 }';
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
      this.settings = {
        resolutionX: 800,
        resolutionY: 600,
        antialiasMin: -1,
        antialiasMax: 1,
        samples: 8,
        contrast: 0.1,
        filter: ImageExporter.FILTERS[1],
        jitter: true
      };
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
      result += '  resolution ' + this.settings.resolutionX + ' ' + this.settings.resolutionY + '\n';
      result += '  aa ' + this.settings.antialiasMin + ' ' + this.settings.antialiasMax + '\n';
      result += '  samples ' + this.settings.samples + '\n';
      result += '  contrast ' + this.settings.contrast + '\n';
      result += '  filter ' + this.settings.filter + '\n';
      result += '  jitter ' + this.settings.jitter + '\n';
      result += '}\n\n';
      return result;
    };

    return ImageExporter;

  })(BlockExporter);

  LightsExporter = (function(_super) {
    __extends(LightsExporter, _super);

    function LightsExporter() {
      LightsExporter.__super__.constructor.call(this);
      this.settings = {
        enabled: true,
        sunskyEnabled: true,
        sunskyUpX: 0,
        sunskyUpY: 1,
        sunskyUpZ: 0,
        sunskyEastX: 0,
        sunskyEastY: 0,
        sunskyEastZ: 1,
        sunskyDirX: 1,
        sunskyDirY: 1,
        sunskyDirZ: 1,
        sunskyTurbidity: 6,
        sunskySamples: 64
      };
      this.lightIndex = {};
    }

    LightsExporter.prototype.addToIndex = function(object3d) {
      if (object3d instanceof THREE.Light && !this.lightIndex[object3d.uuid]) {
        this.lightIndex[object3d.uuid] = object3d;
      }
      return null;
    };

    LightsExporter.prototype.doTraverse = function(object3d) {
      return !(object3d instanceof THREE.SF.PointLight);
    };

    LightsExporter.prototype.exportBlock = function() {
      var light, result, uuid;
      result = '';
      if (!this.settings.enabled) {
        return result;
      }
      if (this.settings.sunskyEnabled) {
        result += 'light {\n';
        result += '  type sunsky\n';
        result += '  up ' + this.settings.sunskyUpX + ' ' + this.settings.sunskyUpY + ' ' + this.settings.sunskyUpZ + '\n';
        result += '  east ' + this.settings.sunskyEastX + ' ' + this.settings.sunskyEastY + ' ' + this.settings.sunskyEastZ + '\n';
        result += '  sundir ' + this.settings.sunskyDirX + ' ' + this.settings.sunskyDirY + ' ' + this.settings.sunskyDirZ + '\n';
        result += '  turbidity ' + this.settings.sunskyTurbidity + '\n';
        result += '  samples ' + this.settings.sunskySamples + '\n';
        result += '}\n\n';
      }
      for (uuid in this.lightIndex) {
        light = this.lightIndex[uuid];
        if (light instanceof THREE.SF.PointLight) {
          result += 'light {\n';
          result += '  type point\n';
          result += '  color ' + this.exportColorTHREE(light.color) + '\n';
          result += '  power ' + light.intensity * 200 + ' \n';
          result += '  p ' + this.exportVector(light.position) + '\n';
        }
        result += '}\n\n';
      }
      return result;
    };

    return LightsExporter;

  })(BlockExporter);

  MaterialsExporter = (function(_super) {
    __extends(MaterialsExporter, _super);

    function MaterialsExporter() {
      MaterialsExporter.__super__.constructor.call(this);
      this.settings = {
        enabled: true
      };
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
      if (!this.settings.enabled) {
        return result;
      }
      for (uuid in this.materialsIndex) {
        material = this.materialsIndex[uuid];
        result += 'shader {\n';
        result += '  name ' + material.uuid + '\n';
        if (material instanceof THREE.SF.ConstantMaterial || material instanceof THREE.MeshBasicMaterial) {
          result += '  type constant\n';
          result += '  color ' + this.exportColorTHREE(material.color) + '\n';
        } else if (material instanceof THREE.SF.DiffuseMaterial || material instanceof THREE.MeshLambertMaterial) {
          result += '  type diffuse\n';
          result += '  diff ' + this.exportColorTHREE(material.color) + '\n';
        } else if (material instanceof THREE.SF.ShinyMaterial) {
          result += '  type shiny\n';
          result += '  diff ' + this.exportColorTHREE(material.color) + '\n';
          result += '  refl ' + material.reflection + '\n';
        } else if (material instanceof THREE.SF.GlassMaterial) {
          result += '  type glass\n';
          result += '  eta ' + material.eta + '\n';
          result += '  color ' + this.exportColorTHREE(material.color) + '\n';
        } else if (material instanceof THREE.SF.MirrorMaterial) {
          result += '  type mirror\n';
          result += '  refl ' + this.exportColorTHREE(material.reflection) + '\n';
        } else if (material instanceof THREE.SF.PhongMaterial || material instanceof THREE.MeshPhongMaterial) {
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
      this.settings = {
        enabled: true,
        convertPrimitives: true
      };
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
      if (!this.settings.enabled) {
        return result;
      }
      for (uuid in this.meshIndex) {
        mesh = this.meshIndex[uuid];
        if (this.settings.convertPrimitives && mesh.geometry instanceof THREE.SphereGeometry) {
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

  ScExporter = (function() {
    function ScExporter() {}

    ScExporter["export"] = function(scene, camera, width, height) {
      var index, scContents;
      index = ScExporter.buildIndex(scene);
      scContents = "\n% Three.js generated Sunflow scene file.\n";
      scContents += 'image {\n';
      scContents += '  resolution ' + width + ' ' + height + '\n';
      scContents += '  aa 0 1\n';
      scContents += '  filter triangle\n';
      scContents += '}\n\n';
      scContents += 'light {\n';
      scContents += '  type sunsky\n';
      scContents += '  up 0 1 0\n';
      scContents += '  east 0 0 1\n';
      scContents += '  sundir 1 1 1\n';
      scContents += '  turbidity 4\n';
      scContents += '  samples 64\n';
      scContents += '}\n\n';
      scContents += this.exportCamera(camera);
      scContents += this.exportShaders(index);
      scContents += this.exportObjects(index);
      ScExporter.disposeIndex(index);
      return scContents;
    };

    ScExporter.buildIndex = function(scene) {
      var geometryMap, index, map, materialMap, meshMap, traverse;
      materialMap = {};
      meshMap = {};
      geometryMap = {};
      map = function(object3d) {
        if (object3d instanceof THREE.Mesh) {
          meshMap[object3d.uuid] = object3d;
          geometryMap[object3d.geometry.uuid] = object3d.geometry;
          return materialMap[object3d.material.uuid] = object3d.material;
        } else if (object3d instanceof THREE.Camera) {
          return console.log("camera", object3d);
        }
      };
      traverse = function(object3d) {
        var child, _i, _len, _ref, _results;
        if (object3d.children.length) {
          _ref = object3d.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            map(child);
            _results.push(traverse(child));
          }
          return _results;
        }
      };
      traverse(scene);
      index = {
        materials: materialMap,
        geometries: geometryMap,
        meshes: meshMap
      };
      return index;
    };

    ScExporter.disposeIndex = function(index) {
      var key;
      for (key in index.materials) {
        index.materials[key] = null;
        delete index.materials[key];
      }
      for (key in index.geometries) {
        index.geometries[key] = null;
        delete index.geometries[key];
      }
      for (key in index.meshes) {
        index.meshes[key] = null;
        delete index.meshes[key];
      }
      return null;
    };

    ScExporter.exportCamera = function(camera) {
      var scContents;
      scContents = '';
      if (camera instanceof THREE.PerspectiveCamera) {
        scContents += 'camera {\n';
        scContents += '  type pinhole\n';
        scContents += '  eye ' + ScExporter.exportVector(camera.position) + '\n';
        scContents += '  target ' + ScExporter.exportVector(camera.rotation) + '\n';
        scContents += '  up ' + ScExporter.exportVector(camera.up) + "\n";
        scContents += '  fov ' + 59. + '\n';
        scContents += '  aspect ' + camera.aspect + '\n';
        scContents += '}\n\n';
      } else {
        console.log("Unsupported camera type");
      }
      return scContents;
    };

    ScExporter.exportShaders = function(index) {
      var material, scContents;
      scContents = '';
      for (material in index.materials) {
        material = index.materials[material];
        scContents += 'shader {\n';
        scContents += '  name ' + material.uuid + '\n';
        scContents += '  type diffuse\n';
        scContents += '  diff ' + ScExporter.exportColor(material.color) + '\n';
        scContents += '}\n\n';
      }
      return scContents;
    };

    ScExporter.exportObjects = function(index) {
      var face, geometry, mesh, scContents, vertex, _i, _j, _len, _len1, _ref, _ref1;
      scContents = '';
      for (geometry in index.geometries) {
        geometry = index.geometries[geometry];
        scContents += 'object {\n';
        scContents += '  noinstance\n';
        scContents += '  type generic-mesh\n';
        scContents += '  name ' + geometry.uuid + '\n';
        scContents += '  points ' + geometry.vertices.length + '\n';
        _ref = geometry.vertices;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          vertex = _ref[_i];
          scContents += '    ' + ScExporter.exportVector(vertex) + '\n';
        }
        scContents += '  triangles ' + geometry.faces.length + '\n';
        _ref1 = geometry.faces;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          face = _ref1[_j];
          scContents += '    ' + ScExporter.exportFace(face) + '\n';
        }
        scContents += '  normals none\n';
        scContents += '  uvs none\n';
        scContents += '}\n\n';
      }
      for (mesh in index.meshes) {
        mesh = index.meshes[mesh];
        /*
        if mesh.geometry instanceof THREE.SphereGeometry
          scContents += 'object {\n'
          scContents += '  shader ' + mesh.material.uuid + '\n'
          scContents += '  type sphere\n'
          scContents += '  name ' + mesh.uuid + '\n'
          scContents += '  c ' + ScExporter.exportVector(mesh.position) + '\n'
          scContents += '  r ' + mesh.geometry.radius + '\n'
          scContents += '}\n\n'
        else
        */

        scContents += 'instance {\n';
        scContents += '  name ' + mesh.uuid + '\n';
        scContents += '  geometry ' + mesh.geometry.uuid + '\n';
        scContents += ScExporter.exportTransform(mesh);
        scContents += '  shader ' + mesh.material.uuid + '\n';
        scContents += '}\n\n';
      }
      return scContents;
    };

    ScExporter.exportVector = function(vector) {
      return vector.x + " " + vector.y + " " + vector.z;
    };

    ScExporter.exportFace = function(face) {
      return face.a + " " + face.b + " " + face.c;
    };

    ScExporter.exportTransform = function(object3d) {
      var element, scContents, _i, _len, _ref;
      scContents = '';
      scContents += '  transform col';
      _ref = object3d.matrixWorld.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        scContents += ' ' + element;
      }
      scContents += '\n';
      return scContents;
    };

    ScExporter.exportColor = function(color) {
      return '{ "sRGB nonlinear" ' + color.r + ' ' + color.g + ' ' + color.b + ' }';
    };

    return ScExporter;

  })();

  TraceDepthsExporter = (function(_super) {
    __extends(TraceDepthsExporter, _super);

    function TraceDepthsExporter() {
      TraceDepthsExporter.__super__.constructor.call(this);
      this.settings = {
        enabled: true,
        diffusion: 1,
        reflection: 4,
        refraction: 4
      };
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
      if (!this.settings.enabled) {
        return result;
      }
      result += 'trace-depths {\n';
      result += '  diff ' + this.settings.diffusion + '\n';
      result += '  refl ' + this.settings.reflection + '\n';
      result += '  refr ' + this.settings.refraction + '\n';
      result += '}\n\n';
      return result;
    };

    return TraceDepthsExporter;

  })(BlockExporter);

  THREE.SF.PointLight = PointLight = (function(_super) {
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

  THREE.SF.SunskyLight = SunskyLight = (function(_super) {
    __extends(SunskyLight, _super);

    function SunskyLight(params) {
      SunskyLight.__super__.constructor.call(this);
      params = params || {};
      this.up = params.up || new THREE.Vector3(0, 1, 0);
      this.east = params.east || new THREE.Vector3(0, 0, 1);
      this.direction = params.direction || new THREE.Vector3(1, 1, 1);
      this.turbidity = params.turbidity || 6;
      this.samples = params.samples || 64;
      this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 1);
      this.add(this.directionalLight);
      this.add(this.hemisphereLight);
    }

    return SunskyLight;

  })(THREE.Object3D);

  THREE.SF.ConstantMaterial = ConstantMaterial = (function(_super) {
    __extends(ConstantMaterial, _super);

    function ConstantMaterial(parameters) {
      ConstantMaterial.__super__.constructor.call(this);
      THREE.MeshPhongMaterial.call(this);
      this.setValues(parameters);
    }

    return ConstantMaterial;

  })(THREE.MeshPhongMaterial);

  THREE.SF.DiffuseMaterial = DiffuseMaterial = (function(_super) {
    __extends(DiffuseMaterial, _super);

    function DiffuseMaterial(parameters) {
      DiffuseMaterial.__super__.constructor.call(this);
      THREE.MeshLambertMaterial.call(this);
      this.setValues(parameters);
    }

    return DiffuseMaterial;

  })(THREE.MeshLambertMaterial);

  THREE.SF.GlassMaterial = GlassMaterial = (function(_super) {
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

  THREE.SF.MirrorMaterial = MirrorMaterial = (function(_super) {
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

  THREE.SF.PhongMaterial = PhongMaterial = (function(_super) {
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

  THREE.SF.ShinyMaterial = ShinyMaterial = (function(_super) {
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

  DatGUI = (function() {
    function DatGUI(renderer) {
      this.renderer = renderer;
      this.create();
    }

    DatGUI.prototype.create = function() {
      var exporter, folder, prop, _i, _len, _ref;
      this.gui = new dat.GUI();
      this.folderNameMap = {
        ImageExporter: "Image Settings",
        TraceDepthsExporter: "Trace Depths",
        CausticsExporter: "Caustics",
        GiExporter: "Global Illumination",
        CameraExporter: "Camera",
        LightsExporter: "Lights",
        MaterialsExporter: "Materials",
        GeometryExporter: "Geometry",
        MeshExporter: "Mesh"
      };
      _ref = this.renderer.exporter.blockExporters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        exporter = _ref[_i];
        if (exporter instanceof GiExporter) {
          folder = this.gui.addFolder(this.folderNameMap[exporter.constructor.name]);
          folder.add(exporter, 'enabled');
          folder.add(exporter, 'type', GiExporter.TYPES);
        } else {
          folder = this.gui.addFolder(this.folderNameMap[exporter.constructor.name]);
          for (prop in exporter.settings) {
            if (exporter instanceof ImageExporter && prop === "filter") {
              folder.add(exporter.settings, prop, ImageExporter.FILTERS);
            } else {
              folder.add(exporter.settings, prop);
            }
          }
        }
      }
      /*
      @imageFolder = @gui.addFolder "Image Settings"
      @imageFolder.add(@renderer.imageSettings,'resolutionX')
      @imageFolder.add @renderer.imageSettings,'resolutionY'
      @imageFolder.add @renderer.imageSettings,'antialiasMin'
      @imageFolder.add @renderer.imageSettings,'antialiasMax'
      @imageFolder.add @renderer.imageSettings,'samples'
      @imageFolder.add @renderer.imageSettings,'contrast'
      @imageFolder.add @renderer.imageSettings,'filter', THREE.SunflowRenderer.IMAGE_FILTERS
      @imageFolder.add @renderer.imageSettings,'jitter'
      */

      return null;
    };

    return DatGUI;

  })();

}).call(this);
