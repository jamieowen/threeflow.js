(function() {
  var AreaLight, BlockExporter, BucketExporter, BufferGeometryExporter, CameraExporter, CausticsExporter, ConstantMaterial, DiffuseMaterial, Exporter, GeometryExporter, GiExporter, GlassMaterial, Gui, ImageExporter, LightingRig, LightingRigLight, LightsExporter, Log, MaterialsExporter, MeshExporter, MirrorMaterial, ModifiersExporter, PhongMaterial, PointLight, ShinyMaterial, Signal, SunflowRenderer, SunskyLight, TraceDepthsExporter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.THREEFLOW = window.THREEFLOW || {};

  THREEFLOW.SunflowRenderer = SunflowRenderer = (function() {
    SunflowRenderer.CONNECTING = "connecting";

    SunflowRenderer.CONNECTED = "connected";

    SunflowRenderer.DISCONNECTED = "disconnected";

    SunflowRenderer.ERROR = "error";

    SunflowRenderer.RENDER_ADDED = "render-added";

    SunflowRenderer.RENDER_START = "render-start";

    SunflowRenderer.RENDER_PROGRESS = "render-progress";

    SunflowRenderer.RENDER_CANCELLED = "render-cancelled";

    SunflowRenderer.RENDER_COMPLETE = "render-complete";

    SunflowRenderer.RENDER_ERROR = "render-error";

    function SunflowRenderer(options) {
      var autoConnect;
      if (options == null) {
        options = {};
      }
      this.onRenderError = __bind(this.onRenderError, this);
      this.onRenderCancelled = __bind(this.onRenderCancelled, this);
      this.onRenderComplete = __bind(this.onRenderComplete, this);
      this.onRenderProgress = __bind(this.onRenderProgress, this);
      this.onRenderStart = __bind(this.onRenderStart, this);
      this.onRenderAdded = __bind(this.onRenderAdded, this);
      this.onDisconnected = __bind(this.onDisconnected, this);
      this.onConnected = __bind(this.onConnected, this);
      THREEFLOW.log(THREEFLOW.VERSION, "/", THREEFLOW.COMMIT);
      autoConnect = options.autoConnect === false ? false : true;
      this.name = options.name || null;
      this.scale = options.scale || 1;
      this.overwrite = options.overwrite || false;
      this.deleteSc = options.deleteSc === false ? false : true;
      this.width = options.width || 800;
      this.height = options.height || 600;
      this.sunflowCl = {
        noGui: false,
        ipr: true,
        hiPri: false
      };
      this.exporter = new Exporter();
      this.image = this.exporter.image;
      this.bucket = this.exporter.bucket;
      this.traceDepths = this.exporter.traceDepths;
      this.caustics = this.exporter.caustics;
      this.gi = this.exporter.gi;
      this.cameras = this.exporter.cameras;
      this.lights = this.exporter.lights;
      this.modifiers = this.exporter.modifiers;
      this.materials = this.exporter.materials;
      this.geometry = this.exporter.geometry;
      this.bufferGeometry = this.exporter.bufferGeometry;
      this.meshes = this.exporter.meshes;
      this.connectionStatus = "";
      this.connected = false;
      this.rendering = false;
      this.onRenderStatus = new THREEFLOW.Signal();
      this.onConnectionStatus = new THREEFLOW.Signal();
      if (autoConnect) {
        this.connect();
      }
    }

    SunflowRenderer.prototype.setSize = function(width, height) {
      this.width = width;
      this.height = height;
      return null;
    };

    SunflowRenderer.prototype.linkTexturePath = function(texture, path) {
      this.exporter.linkTexturePath(texture, path);
      return null;
    };

    SunflowRenderer.prototype.connect = function() {
      if (this.connected) {
        return;
      }
      this.setConnectionStatus(SunflowRenderer.CONNECTING);
      this.socket = io.connect(this.host);
      this.socket.on('connected', this.onConnected);
      this.socket.on('disconnected', this.onDisconnected);
      this.socket.on(SunflowRenderer.RENDER_ADDED, this.onRenderAdded);
      this.socket.on(SunflowRenderer.RENDER_START, this.onRenderStart);
      this.socket.on(SunflowRenderer.RENDER_PROGRESS, this.onRenderProgress);
      this.socket.on(SunflowRenderer.RENDER_COMPLETE, this.onRenderComplete);
      this.socket.on(SunflowRenderer.RENDER_CANCELLED, this.onRenderCancelled);
      this.socket.on(SunflowRenderer.RENDER_ERROR, this.onRenderError);
      return null;
    };

    SunflowRenderer.prototype.render = function(scene, camera, name) {
      var source;
      if (!this.connected) {
        throw new Error("[Threeflow] Call connect() before rendering.");
      } else if (!camera instanceof THREE.PerspectiveCamera) {
        throw new Error("[Threeflow] Only use THREE.PerspectiveCamera.");
      } else if (isNaN(this.width) || isNaN(this.height) || isNaN(this.scale)) {
        throw new Error("[Threeflow] Error with width/height or scale.");
      } else if (!this.rendering) {
        this.onRenderStatus.dispatch({
          status: SunflowRenderer.RENDER_START
        });
        this.rendering = true;
        this.name = name ? name : this.name;
        this.exporter.clean();
        this.exporter.image.resolutionX = this.width * this.scale;
        this.exporter.image.resolutionY = this.height * this.scale;
        this.exporter.camera.camera = camera;
        this.exporter.indexObject3d(scene);
        source = this.exporter.exportCode();
        this.socket.emit("render", {
          source: source,
          options: {
            name: this.name,
            overwrite: this.overwrite,
            deleteSc: this.deleteSc
          },
          sunflowCl: this.sunflowCl
        });
      } else {
        THREEFLOW.log("Render in progress.");
      }
      return null;
    };

    SunflowRenderer.prototype.setConnectionStatus = function(status) {
      if (this.connectionStatus === status) {
        return;
      }
      this.connectionStatus = status;
      this.onConnectionStatus.dispatch({
        status: status
      });
      return null;
    };

    SunflowRenderer.prototype.onConnected = function(data) {
      THREEFLOW.log("[Connected]");
      this.connected = true;
      this.rendering = false;
      this.setConnectionStatus(SunflowRenderer.CONNECTED);
      return null;
    };

    SunflowRenderer.prototype.onDisconnected = function(data) {
      THREEFLOW.log("[Disconnected]");
      this.connected = false;
      this.rendering = false;
      this.setConnectionStatus(SunflowRenderer.DISCONNECTED);
      return null;
    };

    SunflowRenderer.prototype.onRenderAdded = function(data) {
      this.onRenderStatus.dispatch({
        status: SunflowRenderer.RENDER_ADDED
      });
      return null;
    };

    SunflowRenderer.prototype.onRenderStart = function(data) {
      this.onRenderStatus.dispatch({
        status: SunflowRenderer.RENDER_START
      });
      return null;
    };

    SunflowRenderer.prototype.onRenderProgress = function(data) {
      this.onRenderStatus.dispatch({
        status: SunflowRenderer.RENDER_PROGRESS,
        progress: data.progress
      });
      return null;
    };

    SunflowRenderer.prototype.onRenderComplete = function(data) {
      this.rendering = false;
      this.onRenderStatus.dispatch({
        status: SunflowRenderer.RENDER_COMPLETE,
        duration: data
      });
      return null;
    };

    SunflowRenderer.prototype.onRenderCancelled = function(data) {
      this.rendering = false;
      this.onRenderStatus.dispatch({
        status: SunflowRenderer.RENDER_CANCELLED
      });
      return null;
    };

    SunflowRenderer.prototype.onRenderError = function(data) {
      this.rendering = false;
      this.onRenderStatus.dispatch({
        status: SunflowRenderer.RENDER_ERROR,
        message: data
      });
      return null;
    };

    return SunflowRenderer;

  })();

  THREEFLOW.VERSION = '0.6.0-3';

  THREEFLOW.COMMIT = '92c8224';

  BlockExporter = (function() {
    function BlockExporter(exporter) {
      this.exporter = exporter;
    }

    BlockExporter.prototype.clean = function() {
      throw new Error('BlockExporter subclasses must override this method.');
    };

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

  BucketExporter = (function(_super) {
    __extends(BucketExporter, _super);

    BucketExporter.ORDER_TYPES = ['hilbert', 'spiral', 'column', 'row', 'diagonal', 'random'];

    function BucketExporter(exporter) {
      BucketExporter.__super__.constructor.call(this, exporter);
      this.orderTypes = BucketExporter.ORDER_TYPES;
      this.enabled = true;
      this.reverse = false;
      this.size = 64;
      this.order = this.orderTypes[0];
    }

    BucketExporter.prototype.clean = function() {
      return null;
    };

    BucketExporter.prototype.addToIndex = function(object3d) {
      return null;
    };

    BucketExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    BucketExporter.prototype.exportBlock = function() {
      var bucket, result;
      result = '';
      if (!this.enabled) {
        return result;
      }
      bucket = this.size + ' ';
      if (this.reverse) {
        bucket += '"reverse ' + this.order + '"';
      } else {
        bucket += this.order;
      }
      result += 'bucket ' + bucket + '\n';
      return result;
    };

    return BucketExporter;

  })(BlockExporter);

  BufferGeometryExporter = (function(_super) {
    __extends(BufferGeometryExporter, _super);

    function BufferGeometryExporter(exporter) {
      BufferGeometryExporter.__super__.constructor.call(this, exporter);
      this.normals = true;
      this.uvs = false;
      this.geometrySourceCache = {};
      this.bufferGeometryIndex = null;
    }

    BufferGeometryExporter.prototype.clean = function() {
      this.bufferGeometryIndex = {};
      return null;
    };

    BufferGeometryExporter.prototype.addToIndex = function(object3d) {
      if (!object3d instanceof THREE.Mesh) {
        return;
      }
      if (object3d.geometry instanceof THREE.BufferGeometry && !this.bufferGeometryIndex[object3d.geometry.uuid]) {
        this.bufferGeometryIndex[object3d.geometry.uuid] = {
          geometry: object3d.geometry,
          faceMaterials: false
        };
      }
      return null;
    };

    BufferGeometryExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    BufferGeometryExporter.prototype.exportBlock = function() {
      var attributes, entry, face, i, index, indices, normals, offset, offsets, positions, result, result2, tris, uuid, _i, _j, _k, _l, _len, _len1, _m, _n, _o, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      result = '';
      for (uuid in this.bufferGeometryIndex) {
        entry = this.bufferGeometryIndex[uuid];
        if (!entry.geometry._tf_noCache && this.exporter.useGeometrySourceCache && this.geometrySourceCache[uuid]) {
          result = this.geometrySourceCache[uuid];
          continue;
        }
        result += 'object {\n';
        result += '  noinstance\n';
        result += '  type generic-mesh\n';
        result += '  name ' + uuid + '\n';
        offsets = entry.geometry.offsets;
        attributes = entry.geometry.attributes;
        positions = attributes.position.array;
        normals = attributes.normal.array;
        result += '  points ' + (positions.length / 3) + '\n';
        for (i = _i = 0, _ref = positions.length; _i < _ref; i = _i += 3) {
          result += '    ' + positions[i] + ' ' + positions[i + 1] + ' ' + positions[i + 2] + '\n';
        }
        if (attributes.index) {
          indices = attributes.index.array;
          if (offsets.length) {
            tris = 0;
            result2 = '';
            for (_j = 0, _len = offsets.length; _j < _len; _j++) {
              offset = offsets[_j];
              index = offset.index;
              for (i = _k = _ref1 = offset.start, _ref2 = offset.start + offset.count; _k < _ref2; i = _k += 3) {
                tris++;
                result2 += '    ' + (indices[i] + index) + ' ' + (indices[i + 1] + index) + ' ' + (indices[i + 2] + index) + '\n';
              }
            }
            result += '  triangles ' + tris + '\n';
            result += result2;
          } else {
            result += '  triangles ' + (indices.length / 3) + '\n';
            for (i = _l = 0, _ref3 = indices.length; _l < _ref3; i = _l += 3) {
              result += '    ' + indices[i] + ' ' + indices[i + 1] + ' ' + indices[i + 2] + '\n';
            }
          }
        } else {
          result += '  triangles ' + (positions.length / 9) + '\n';
          for (i = _m = 0, _ref4 = positions.length / 3; _m < _ref4; i = _m += 3) {
            result += '    ' + i + ' ' + (i + 1) + ' ' + (i + 2) + '\n';
          }
        }
        if (this.normals && normals.length > 0) {
          result += '  normals vertex\n';
          for (i = _n = 0, _ref5 = normals.length; _n < _ref5; i = _n += 3) {
            result += '    ' + normals[i] + ' ' + normals[i + 1] + ' ' + normals[i + 2] + '\n';
          }
          result += '\n';
        } else {
          result += '  normals none\n';
        }
        if (this.uvs) {
          result += '  uvs none\n';
        } else {
          result += '  uvs none\n';
        }
        if (entry.faceMaterials) {
          result += '  face_shaders\n';
          _ref6 = entry.geometry.faces;
          for (_o = 0, _len1 = _ref6.length; _o < _len1; _o++) {
            face = _ref6[_o];
            result += '    ' + face.materialIndex + '\n';
          }
        }
        result += '}\n\n';
        if (!entry.geometry._tf_noCache && this.exporter.useGeometrySourceCache) {
          this.geometrySourceCache[uuid] = result;
        }
      }
      return result;
    };

    return BufferGeometryExporter;

  })(BlockExporter);

  CameraExporter = (function(_super) {
    __extends(CameraExporter, _super);

    function CameraExporter(exporter) {
      CameraExporter.__super__.constructor.call(this, exporter);
      this.helperVec = new THREE.Vector3();
      this.camera = null;
    }

    CameraExporter.prototype.clean = function() {
      this.camera = null;
      return null;
    };

    CameraExporter.prototype.addToIndex = function(object3d) {
      return null;
    };

    CameraExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    CameraExporter.prototype.exportBlock = function() {
      var result;
      result = '';
      result += 'camera {\n';
      result += '  type pinhole\n';
      this.helperVec.copy(this.camera.position);
      this.helperVec.applyMatrix4(this.camera.matrixWorld);
      result += '  eye ' + this.exportVector(this.camera.position) + '\n';
      this.helperVec.set(0, 0, -1);
      this.helperVec.applyMatrix4(this.camera.matrixWorld);
      result += '  target ' + this.exportVector(this.helperVec) + '\n';
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

    function CausticsExporter(exporter) {
      CausticsExporter.__super__.constructor.call(this, exporter);
      this.enabled = false;
      this.photons = 10000;
      this.kdEstimate = 100;
      this.kdRadius = 0.5;
    }

    CausticsExporter.prototype.clean = function() {
      return null;
    };

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
    Exporter.EXCLUDED_OBJECT3D_TYPES = [THREE.Camera, THREE.Light, THREE.Bone, THREE.LOD, THREE.Line, THREE.MorphAnimMesh, THREE.ParticleSystem, THREE.SkinnedMesh, THREE.Sprite, THREE.ArrowHelper, THREE.BoundingBoxHelper, THREE.DirectionalLightHelper, THREE.HemisphereLightHelper, THREE.PointLightHelper, THREE.SpotLightHelper, THREE.ImmediateRenderObject, THREE.LensFlare, THREE.MorphBlendMesh];

    Exporter.__checkedExcluded = false;

    Exporter.__checkExcluded = function() {
      var CHECK_EXCLUDED_OBJECT3D_TYPES, cls, _i, _len;
      if (!Exporter.__checkedExcluded) {
        CHECK_EXCLUDED_OBJECT3D_TYPES = [THREE.TransformControls, THREE.AudioObject];
        for (_i = 0, _len = CHECK_EXCLUDED_OBJECT3D_TYPES.length; _i < _len; _i++) {
          cls = CHECK_EXCLUDED_OBJECT3D_TYPES[_i];
          if (cls !== void 0 && typeof cls === "function") {
            Exporter.EXCLUDED_OBJECT3D_TYPES.push(cls);
          }
        }
        Exporter.__checkedExcluded = true;
      }
      return null;
    };

    function Exporter() {
      Exporter.__checkExcluded();
      this.exporterSettings = {
        convertPrimitives: false
      };
      this.blockExporters = [];
      this.image = this.addBlockExporter(new ImageExporter(this));
      this.bucket = this.addBlockExporter(new BucketExporter(this));
      this.traceDepths = this.addBlockExporter(new TraceDepthsExporter(this));
      this.caustics = this.addBlockExporter(new CausticsExporter(this));
      this.gi = this.addBlockExporter(new GiExporter(this));
      this.camera = this.addBlockExporter(new CameraExporter(this));
      this.lights = this.addBlockExporter(new LightsExporter(this));
      this.modifiers = this.addBlockExporter(new ModifiersExporter(this));
      this.materials = this.addBlockExporter(new MaterialsExporter(this));
      this.geometry = this.addBlockExporter(new GeometryExporter(this));
      this.bufferGeometry = this.addBlockExporter(new BufferGeometryExporter(this));
      this.meshes = this.addBlockExporter(new MeshExporter(this));
      this.useGeometrySourceCache = true;
      this.textureLinkages = {};
    }

    Exporter.prototype.linkTexturePath = function(texture, path) {
      if (!texture instanceof THREE.Texture) {
        throw new Error("Texture must be of type THREE.Texture.");
      }
      if (path === null) {
        throw new Error("Texture path must not be null.");
      }
      this.textureLinkages[texture.uuid] = path;
      return null;
    };

    Exporter.prototype.addBlockExporter = function(exporter) {
      if (!exporter instanceof BlockExporter) {
        throw new Error('Extend BlockExporter');
      } else {
        this.blockExporters.push(exporter);
      }
      return exporter;
    };

    Exporter.prototype.clean = function() {
      var blockExporter, _i, _len, _ref;
      _ref = this.blockExporters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        blockExporter = _ref[_i];
        blockExporter.clean();
      }
      return null;
    };

    Exporter.prototype.indexObject3d = function(object3d) {
      var blockExporter, child, cls, doTraverse, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      _ref = Exporter.EXCLUDED_OBJECT3D_TYPES;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cls = _ref[_i];
        if (object3d instanceof cls) {
          THREEFLOW.warn("Ignored object.", object3d);
          return;
        }
      }
      if (object3d.children.length) {
        _ref1 = object3d.children;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          child = _ref1[_j];
          doTraverse = true;
          _ref2 = this.blockExporters;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            blockExporter = _ref2[_k];
            if (!child._tf_noIndex) {
              blockExporter.addToIndex(child);
            }
            doTraverse = doTraverse && blockExporter.doTraverse(child);
          }
          if (doTraverse && !child._tf_noTraverse && !child._tf_noIndex) {
            this.indexObject3d(child);
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

    function GeometryExporter(exporter) {
      GeometryExporter.__super__.constructor.call(this, exporter);
      this.normals = true;
      this.vertexNormals = false;
      this.uvs = true;
      this.geometrySourceCache = {};
      this.geometryIndex = null;
    }

    GeometryExporter.prototype.clean = function() {
      this.geometryIndex = {};
      return null;
    };

    GeometryExporter.prototype.addToIndex = function(object3d) {
      var faceMaterials;
      if (!object3d instanceof THREE.Mesh) {
        return;
      }
      if (object3d.geometry instanceof THREE.Geometry) {
        if (object3d.geometry instanceof THREEFLOW.InfinitePlaneGeometry) {
          return;
        }
        faceMaterials = object3d.material instanceof THREE.MeshFaceMaterial;
        if (!this.geometryIndex[object3d.geometry.uuid]) {
          this.geometryIndex[object3d.geometry.uuid] = {
            geometry: object3d.geometry,
            faceMaterials: faceMaterials
          };
        } else if (!this.geometryIndex[object3d.geometry.uuid].faceMaterials && faceMaterials) {
          this.geometryIndex[object3d.geometry.uuid].faceMaterials = true;
        }
      }
      return null;
    };

    GeometryExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    GeometryExporter.prototype.exportBlock = function() {
      var entry, face, normal, normals, result, uuid, uv, uvs, v1, v2, v3, vertex, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _ref, _ref1, _ref2, _ref3, _ref4;
      result = '';
      for (uuid in this.geometryIndex) {
        entry = this.geometryIndex[uuid];
        if (!entry.geometry._tf_noCache && this.exporter.useGeometrySourceCache && this.geometrySourceCache[uuid]) {
          result = this.geometrySourceCache[uuid];
          continue;
        }
        result += 'object {\n';
        result += '  noinstance\n';
        result += '  type generic-mesh\n';
        result += '  name ' + uuid + '\n';
        result += '  points ' + entry.geometry.vertices.length + '\n';
        _ref = entry.geometry.vertices;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          vertex = _ref[_i];
          result += '    ' + this.exportVector(vertex) + '\n';
        }
        result += '  triangles ' + entry.geometry.faces.length + '\n';
        _ref1 = entry.geometry.faces;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          face = _ref1[_j];
          result += '    ' + this.exportFace(face) + '\n';
        }
        if (this.normals && this.vertexNormals) {
          normals = [];
          _ref2 = entry.geometry.faces;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            face = _ref2[_k];
            normals[face.a] = face.vertexNormals[0];
            normals[face.b] = face.vertexNormals[1];
            normals[face.c] = face.vertexNormals[2];
          }
          if (normals.length > 0 && normals.length === entry.geometry.vertices.length) {
            result += '  normals vertex\n';
            for (_l = 0, _len3 = normals.length; _l < _len3; _l++) {
              normal = normals[_l];
              result += '    ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';
            }
            result += '\n';
          } else {
            THREEFLOW.warn("Problem with geometry normals.", object3d);
            result += '  normals none\n';
          }
        } else if (this.normals && !this.vertexNormals) {
          result += '  normals facevarying\n';
          _ref3 = entry.geometry.faces;
          for (_m = 0, _len4 = _ref3.length; _m < _len4; _m++) {
            face = _ref3[_m];
            v1 = face.vertexNormals[0];
            v2 = face.vertexNormals[1];
            v3 = face.vertexNormals[2];
            result += '    ' + v1.x + ' ' + v1.y + ' ' + v1.z + ' ' + v2.x + ' ' + v2.y + ' ' + v2.z + ' ' + v3.x + ' ' + v3.y + ' ' + v3.z + '\n';
          }
        } else {
          result += '  normals none\n';
        }
        if (this.uvs) {
          uvs = entry.geometry.faceVertexUvs[0];
          if (uvs.length === entry.geometry.faces.length) {
            result += '  uvs facevarying\n';
            for (_n = 0, _len5 = uvs.length; _n < _len5; _n++) {
              uv = uvs[_n];
              result += '    ' + uv[0].x + ' ' + uv[0].y + ' ' + uv[1].x + ' ' + uv[1].y + ' ' + uv[2].x + ' ' + uv[2].y + '\n';
            }
          } else {
            THREEFLOW.warn("UV count didn't match face count.", entry.geometry);
            result += '  uvs none\n';
          }
        } else {
          result += '  uvs none\n';
        }
        if (entry.faceMaterials) {
          result += '  face_shaders\n';
          _ref4 = entry.geometry.faces;
          for (_o = 0, _len6 = _ref4.length; _o < _len6; _o++) {
            face = _ref4[_o];
            result += '    ' + face.materialIndex + '\n';
          }
        }
        result += '}\n\n';
        if (!entry.geometry._tf_noCache && this.exporter.useGeometrySourceCache) {
          this.geometrySourceCache[uuid] = result;
        }
      }
      return result;
    };

    return GeometryExporter;

  })(BlockExporter);

  GiExporter = (function(_super) {
    __extends(GiExporter, _super);

    GiExporter.GLOBAL_MAP_TYPES = ['grid', 'path'];

    GiExporter.TYPES = ['igi', 'irr-cache', 'path', 'ambocc', 'fake'];

    function GiExporter(exporter) {
      GiExporter.__super__.constructor.call(this, exporter);
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
        sky: 0xa0a0ef,
        ground: 0xefefef
      };
    }

    GiExporter.prototype.clean = function() {
      return null;
    };

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
        result += '  samples ' + this.path.samples + '\n';
      } else if (this.type === 'ambocc') {
        result += '  bright { "sRGB nonlinear" 1 1 1 }' + '\n';
        result += '  dark { "sRGB nonlinear" 0 0 0 }' + '\n';
        result += '  samples ' + this.ambOcc.samples + '\n';
        result += '  maxdist ' + this.ambOcc.maxDistance + '\n';
      } else if (this.type === 'fake') {
        result += '  up ' + this.exportVector(this.fake.up) + '\n';
        result += '  sky ' + this.exportColorHex(this.fake.sky) + '\n';
        result += '  ground ' + this.exportColorHex(this.fake.ground) + '\n';
      }
      result += '}\n\n';
      return result;
    };

    return GiExporter;

  })(BlockExporter);

  ImageExporter = (function(_super) {
    __extends(ImageExporter, _super);

    ImageExporter.FILTERS = ['box', 'triangle', 'gaussian', 'mitchell', 'catmull-rom', 'blackman-harris', 'sinc', 'lanczos', 'ospline'];

    function ImageExporter(exporter) {
      ImageExporter.__super__.constructor.call(this, exporter);
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

    ImageExporter.prototype.clean = function() {
      return null;
    };

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
      result += "accel kdtree\n\n";
      return result;
    };

    return ImageExporter;

  })(BlockExporter);

  LightsExporter = (function(_super) {
    __extends(LightsExporter, _super);

    function LightsExporter(exporter) {
      LightsExporter.__super__.constructor.call(this, exporter);
      this.override = {
        samples: {
          enabled: false,
          value: 64
        }
      };
      this.helperVec = new THREE.Vector3();
      this.lightIndex = null;
    }

    LightsExporter.prototype.clean = function() {
      this.lightIndex = {};
      return null;
    };

    LightsExporter.prototype.addToIndex = function(object3d) {
      var indexed;
      indexed = this.lightIndex[object3d.uuid];
      if (!indexed && object3d instanceof THREEFLOW.SunskyLight) {
        this.lightIndex[object3d.uuid] = object3d;
      } else if (!indexed && object3d instanceof THREEFLOW.PointLight) {
        this.lightIndex[object3d.uuid] = object3d;
      } else if (!indexed && object3d instanceof THREEFLOW.AreaLight) {
        this.lightIndex[object3d.uuid] = object3d;
      }
      return null;
    };

    LightsExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    LightsExporter.prototype.exportBlock = function() {
      var face, light, result, uuid, vertex, _i, _j, _len, _len1, _ref, _ref1;
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
          if (this.override.samples.enabled) {
            result += '  samples ' + this.override.samples.value + '\n';
          } else {
            result += '  samples ' + light.samples + '\n';
          }
          result += '}\n\n';
        } else if (light instanceof THREEFLOW.PointLight) {
          result += 'light {\n';
          result += '  type point\n';
          result += '  color ' + this.exportColorTHREE(light.color) + '\n';
          result += '  power ' + light.power + ' \n';
          result += '  p ' + this.exportVector(light.position) + '\n';
          result += '}\n\n';
        } else if (light instanceof THREEFLOW.AreaLight) {
          result += 'light {\n';
          result += '  type meshlight\n';
          result += '  name ' + light.uuid + '\n';
          result += '  emit ' + this.exportColorTHREE(light.color) + '\n';
          result += '  radiance ' + light.radiance + ' \n';
          if (this.override.samples.enabled) {
            result += '  samples ' + this.override.samples.value + '\n';
          } else {
            result += '  samples ' + light.samples + '\n';
          }
          result += '  points ' + light.geometry.vertices.length + '\n';
          _ref = light.geometry.vertices;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            vertex = _ref[_i];
            this.helperVec.copy(vertex);
            this.helperVec.applyMatrix4(light.matrixWorld);
            result += '    ' + this.exportVector(this.helperVec) + '\n';
          }
          result += '  triangles ' + light.geometry.faces.length + '\n';
          _ref1 = light.geometry.faces;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            face = _ref1[_j];
            result += '    ' + this.exportFace(face) + '\n';
          }
          result += '}\n\n';
        }
      }
      return result;
    };

    return LightsExporter;

  })(BlockExporter);

  MaterialsExporter = (function(_super) {
    __extends(MaterialsExporter, _super);

    function MaterialsExporter(exporter) {
      MaterialsExporter.__super__.constructor.call(this, exporter);
      this.materialsIndex = null;
    }

    MaterialsExporter.prototype.clean = function() {
      this.materialsIndex = {};
      return null;
    };

    MaterialsExporter.prototype.addToIndex = function(object3d) {
      var material, _i, _len, _ref;
      if (object3d instanceof THREE.Mesh) {
        if (object3d.material instanceof THREE.MeshFaceMaterial) {
          _ref = object3d.material.materials;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            material = _ref[_i];
            if (!this.materialsIndex[material.uuid]) {
              this.materialsIndex[material.uuid] = material;
            }
          }
        } else if (object3d.material && !this.materialsIndex[object3d.material.uuid]) {
          this.materialsIndex[object3d.material.uuid] = object3d.material;
        }
      }
      return null;
    };

    MaterialsExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    MaterialsExporter.prototype.declareDiffOrTexture = function(material) {
      var hasTexture, result, texturePath;
      result = '';
      hasTexture = material.map instanceof THREE.Texture;
      if (hasTexture) {
        texturePath = this.exporter.textureLinkages[material.map.uuid];
      } else {
        texturePath = null;
      }
      if (hasTexture && !texturePath) {
        THREEFLOW.warn("Found texture on material but no texture linkage.", "( Use linkTexturePath() )");
        hasTexture = false;
      }
      if (hasTexture) {
        result += '  texture "' + texturePath + '"\n';
      } else {
        result += '  diff ' + this.exportColorTHREE(material.color) + '\n';
      }
      return result;
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
          result += this.declareDiffOrTexture(material);
        } else if (material instanceof THREEFLOW.ShinyMaterial) {
          result += '  type shiny\n';
          result += this.declareDiffOrTexture(material);
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
          result += this.declareDiffOrTexture(material);
          result += '  spec ' + this.exportColorTHREE(material.specular) + ' ' + material.shininess + '\n';
          result += '  samples ' + (material.samples || 4) + '\n';
        } else {
          THREEFLOW.warn("Unsupported Material type. Will map to black THREEFLOW.DiffuseMaterial.", material);
          result += '  type diffuse\n';
          result += '  diff { "sRGB nonlinear" 0 0 0 }\n';
        }
        result += '}\n\n';
      }
      return result;
    };

    return MaterialsExporter;

  })(BlockExporter);

  MeshExporter = (function(_super) {
    __extends(MeshExporter, _super);

    function MeshExporter(exporter) {
      MeshExporter.__super__.constructor.call(this, exporter);
      this.convertPrimitives = true;
      this.meshIndex = null;
    }

    MeshExporter.prototype.clean = function() {
      this.meshIndex = {};
      return null;
    };

    MeshExporter.prototype.addToIndex = function(object3d) {
      if (!(object3d instanceof THREE.Mesh)) {
        return;
      }
      if (!this.meshIndex[object3d.uuid]) {
        this.meshIndex[object3d.uuid] = object3d;
      }
      return null;
    };

    MeshExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    MeshExporter.prototype.exportBlock = function() {
      var material, mesh, result, uuid, _i, _len, _ref;
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
        } else if (mesh.material instanceof THREE.MeshFaceMaterial) {
          result += 'instance {\n';
          result += '  name ' + mesh.uuid + '\n';
          result += '  geometry ' + mesh.geometry.uuid + '\n';
          result += '  transform col' + this.exportTransform(mesh) + '\n';
          result += '  shaders ' + mesh.material.materials.length + '\n';
          _ref = mesh.material.materials;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            material = _ref[_i];
            result += '    ' + material.uuid + '\n';
          }
        } else {
          result += 'instance {\n';
          result += '  name ' + mesh.uuid + '\n';
          result += '  geometry ' + mesh.geometry.uuid + '\n';
          result += '  transform col' + this.exportTransform(mesh) + '\n';
          result += '  shader ' + mesh.material.uuid + '\n';
          if (mesh.material.bumpMap) {
            result += '  modifier ' + mesh.material.uuid + '-MOD\n';
          }
        }
        result += '}\n\n';
      }
      return result;
    };

    return MeshExporter;

  })(BlockExporter);

  ModifiersExporter = (function(_super) {
    __extends(ModifiersExporter, _super);

    function ModifiersExporter(exporter) {
      ModifiersExporter.__super__.constructor.call(this, exporter);
      this.modifiersIndex = null;
    }

    ModifiersExporter.prototype.clean = function() {
      this.modifiersIndex = {};
      return null;
    };

    ModifiersExporter.prototype.addToIndex = function(object3d) {
      var material;
      if (!(object3d instanceof THREE.Mesh)) {
        return;
      }
      material = object3d.material;
      if (!this.modifiersIndex[material.uuid] && material.bumpMap instanceof THREE.Texture) {
        this.modifiersIndex[material.uuid] = material;
      }
      return null;
    };

    ModifiersExporter.prototype.doTraverse = function(object3d) {
      return true;
    };

    ModifiersExporter.prototype.exportBlock = function() {
      var material, result, texturePath, uuid;
      result = '';
      for (uuid in this.modifiersIndex) {
        material = this.modifiersIndex[uuid];
        texturePath = this.exporter.textureLinkages[material.bumpMap.uuid];
        if (!texturePath) {
          THREEFLOW.warn("Found bumpMap texture on material but no texture linkage.", "( Use linkTexturePath() )");
        } else {
          result += 'modifier {\n';
          result += '  name ' + material.uuid + '-MOD\n';
          result += '  type bump\n';
          result += '  texture ' + texturePath + '\n';
          result += '  scale ' + (material.bumpScale * -0.005) + '\n';
          result += '}\n';
        }
      }
      return result;
    };

    return ModifiersExporter;

  })(BlockExporter);

  TraceDepthsExporter = (function(_super) {
    __extends(TraceDepthsExporter, _super);

    function TraceDepthsExporter(exporter) {
      TraceDepthsExporter.__super__.constructor.call(this, exporter);
      this.enabled = false;
      this.diffusion = 1;
      this.reflection = 1;
      this.refraction = 1;
    }

    TraceDepthsExporter.prototype.clean = function() {
      return null;
    };

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

  THREEFLOW.Gui = Gui = (function() {
    function Gui(renderer, lightingRig) {
      var light, statusObject, updateDisplay, updateFolder, updateType, _i, _len, _ref,
        _this = this;
      this.renderer = renderer;
      this.lightingRig = lightingRig;
      this._onRenderIPR = __bind(this._onRenderIPR, this);
      this._onRender = __bind(this._onRender, this);
      if (!window.dat && !window.dat.GUI) {
        throw new Error("No dat.GUI found.");
      }
      this.gui = new dat.GUI();
      this.onRender = new THREEFLOW.Signal();
      updateDisplay = function() {
        var controller, _i, _len, _ref, _results;
        _ref = _this.gui.__controllers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          controller = _ref[_i];
          _results.push(controller.updateDisplay());
        }
        return _results;
      };
      statusObject = {
        status: ''
      };
      this.renderer.onConnectionStatus.add(function(event) {
        statusObject.status = event.status;
        return updateDisplay();
      });
      this.renderer.onRenderStatus.add(function(event) {
        if (event.status === THREEFLOW.SunflowRenderer.RENDER_PROGRESS) {
          statusObject.status = "rendering / " + event.progress + "%";
        } else {
          statusObject.status = event.status;
        }
        return updateDisplay();
      });
      this.gui.add(THREEFLOW, "VERSION").name("THREEFLOW");
      this.gui.add(statusObject, "status").name("Status");
      this.gui.add(this, "_onRender").name("Render");
      this.gui.add(this, "_onRenderIPR").name("Render IPR");
      this.imageFolder = this.gui.addFolder("Image");
      this.bucketFolder = this.gui.addFolder("Bucket Size/Order");
      this.traceDepthsFolder = this.gui.addFolder("Trace Depths");
      this.causticsFolder = this.gui.addFolder("Caustics");
      this.giFolder = this.gui.addFolder("Global Illumination");
      if (this.lightingRig) {
        this.lightingRigFolder = this.gui.addFolder("Lighting Rig");
        this.lightingRigFolder.add(this.lightingRig, "saveState").name("Dump JSON").onChange(function() {
          var state;
          state = _this.lightingRig.saveState();
          return console.log(JSON.stringify(state));
        });
        _ref = this.lightingRig.lights;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          light = _ref[_i];
          this.addRigLight(this.lightingRigFolder, light);
        }
        this.backdropFolder = this.lightingRigFolder.addFolder("Backdrop");
        this.backdropFolder.add(this.lightingRig.backdropMaterial, "wireframe");
        this.backdropFolder.add(this.lightingRig.backdropMaterial, "transparent");
        this.backdropFolder.add(this.lightingRig.backdropMaterial, "opacity", 0, 1);
      }
      this.overridesFolder = this.gui.addFolder("Overrides");
      this.otherFolder = this.gui.addFolder("Other");
      this.imageFolder.add(this.renderer, "scale");
      this.imageFolder.add(this.renderer.image, "antialiasMin");
      this.imageFolder.add(this.renderer.image, "antialiasMax");
      this.imageFolder.add(this.renderer.image, "samples");
      this.imageFolder.add(this.renderer.image, "contrast");
      this.imageFolder.add(this.renderer.image, "filter", this.renderer.image.filterTypes);
      this.imageFolder.add(this.renderer.image, "jitter");
      this.bucketFolder.add(this.renderer.bucket, "enabled");
      this.bucketFolder.add(this.renderer.bucket, "size");
      this.bucketFolder.add(this.renderer.bucket, "order", this.renderer.bucket.orderTypes);
      this.bucketFolder.add(this.renderer.bucket, "reverse");
      this.traceDepthsFolder.add(this.renderer.traceDepths, "enabled");
      this.traceDepthsFolder.add(this.renderer.traceDepths, "diffusion");
      this.traceDepthsFolder.add(this.renderer.traceDepths, "reflection");
      this.traceDepthsFolder.add(this.renderer.traceDepths, "refraction");
      this.causticsFolder.add(this.renderer.caustics, "enabled");
      this.causticsFolder.add(this.renderer.caustics, "photons");
      this.causticsFolder.add(this.renderer.caustics, "kdEstimate");
      this.causticsFolder.add(this.renderer.caustics, "kdRadius");
      this.overridesFolder.add(this.renderer.lights.override.samples, "enabled").name("lightSamples");
      this.overridesFolder.add(this.renderer.lights.override.samples, "value").name("lightValue");
      this.otherFolder.add(this.renderer.meshes, "convertPrimitives");
      this.otherFolder.add(this.renderer.geometry, "normals").name("geomNormals");
      this.otherFolder.add(this.renderer.bufferGeometry, "normals").name("bufferGeomNormals");
      this.giFolder.add(this.renderer.gi, "enabled");
      this.giFolder.add(this.renderer.gi, "type", this.renderer.gi.types).onChange(function(value) {
        return updateType(value);
      });
      this.giTypes = [
        {
          type: this.renderer.gi.types[0],
          name: "Instant GI",
          property: "igi"
        }, {
          type: this.renderer.gi.types[1],
          name: "Irradiance Caching / Final Gathering",
          property: "irrCache"
        }, {
          type: this.renderer.gi.types[2],
          name: "Path Tracing",
          property: "path"
        }, {
          type: this.renderer.gi.types[3],
          name: "Ambient Occlusion",
          property: "ambOcc"
        }, {
          type: this.renderer.gi.types[4],
          name: "Fake Ambient Term",
          property: "fake"
        }
      ];
      this.giSubFolder = null;
      updateFolder = function(type) {
        var controller, controllers, fake, giType, giTypeProperty, property, _j, _len1;
        if (!_this.giSubFolder) {
          _this.giSubFolder = _this.giFolder.addFolder(type.name);
        } else {
          controllers = _this.giSubFolder.__controllers.slice(0);
          for (_j = 0, _len1 = controllers.length; _j < _len1; _j++) {
            controller = controllers[_j];
            _this.giSubFolder.remove(controller);
          }
          _this.giSubFolder.__controllers.splice(0);
          _this.giSubFolder.__ul.firstChild.innerHTML = type.name;
        }
        giType = type.type;
        giTypeProperty = type.property;
        for (property in _this.renderer.gi[giTypeProperty]) {
          if (giType === "irr-cache" && property === "globalMap") {
            _this.giSubFolder.add(_this.renderer.gi.irrCache, "globalMap", _this.renderer.gi.globalMapTypes);
          } else if (giType === "ambocc" && (property === "bright" || property === "dark")) {
            _this.giSubFolder.addColor(_this.renderer.gi.ambOcc, property);
          } else if (giType === "fake" && property === "up") {
            fake = {
              upX: _this.renderer.gi.fake.up.x,
              upY: _this.renderer.gi.fake.up.y,
              upZ: _this.renderer.gi.fake.up.z
            };
            _this.giSubFolder.add(fake, "upX").onChange(function(value) {
              return this.renderer.gi.fake.up.x = value;
            });
            _this.giSubFolder.add(fake, "upY").onChange(function(value) {
              return this.renderer.gi.fake.up.y = value;
            });
            _this.giSubFolder.add(fake, "upZ").onChange(function(value) {
              return this.renderer.gi.fake.up.z = value;
            });
          } else if (giType === "fake" && (property === "sky" || property === "ground")) {
            _this.giSubFolder.addColor(_this.renderer.gi.fake, property);
          } else {
            _this.giSubFolder.add(_this.renderer.gi[giTypeProperty], property);
          }
        }
        _this.giSubFolder.open();
        return null;
      };
      updateType = function(type) {
        _this.renderer.gi.type = type;
        updateFolder(_this.giTypes[_this.renderer.gi.types.indexOf(type)]);
        return null;
      };
      updateType(this.renderer.gi.type);
      null;
    }

    Gui.prototype.addRigLight = function(gui, rigLight) {
      var folder;
      folder = gui.addFolder(rigLight.name);
      folder.add(rigLight, "enabled");
      if (rigLight.isKey) {
        folder.open();
        folder.add(rigLight, "radiance", 0, 200);
      } else {
        folder.add(rigLight, "radiance", 0, 100).listen();
      }
      folder.addColor(rigLight, "color");
      return folder.add(rigLight, "geometryType", THREEFLOW.LightingRigLight.LIGHT_GEOMETRY_TYPES);
    };

    Gui.prototype._onRender = function() {
      this.renderer.sunflowCl.ipr = false;
      return this.onRender.dispatch();
    };

    Gui.prototype._onRenderIPR = function() {
      this.renderer.sunflowCl.ipr = true;
      return this.onRender.dispatch();
    };

    return Gui;

  })();

  /*
  
  params :
    # both
    color: 0xffffff
  
    # three.js ( AreaLight )
    intensity: 1
    width: 1
    height: 1
  
    # threeflow / sunflow
    radiance: 100.0
    samples: 16
    geometry: THREE.PlaneGeometry ( or any other geometry object )
    simulate: true
    markers: true
  */


  THREEFLOW.AreaLight = AreaLight = (function() {
    function AreaLight(params) {
      if (params == null) {
        params = {};
      }
      THREE.Object3D.call(this);
      this._tf_noTraverse = true;
      this._color = new THREE.Color(params.color);
      this._radiance = params.radiance || 100.0;
      this.samples = params.samples || 16;
      this.markerMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        side: THREE.DoubleSide,
        color: this._color
      });
      this.lineGeometry = new THREE.Geometry();
      this.lineGeometry.vertices.push(new THREE.Vector3());
      this.lineGeometry.vertices.push(new THREE.Vector3(0, 0, 100));
      this.lineMesh = new THREE.Line(this.lineGeometry, new THREE.LineBasicMaterial({
        color: this._color.getHex()
      }));
      this.lineMesh.name = "LINE MESH";
      this.lineMesh.matrixAutoUpdate = false;
      this.add(this.lineMesh);
      this.toIntensity = 1;
      this.planar = true;
      this.planarDirection = new THREE.Vector3();
      this.geometryMesh = null;
      this.geometry = params.geometry || new THREE.PlaneGeometry(100, 100);
      if (params.simulate !== false) {
        this.simulate = true;
      }
    }

    AreaLight.prototype = Object.create(THREE.Object3D.prototype);

    Object.defineProperties(AreaLight.prototype, {
      color: {
        get: function() {
          return this._color;
        },
        set: function(value) {
          this._color = value;
          if (this.light) {
            this.light.color.setRGB(this._color);
          }
          return this.markerMaterial.color = this._color;
        }
      },
      radiance: {
        get: function() {
          return this._radiance;
        },
        set: function(value) {
          if (this._radiance === value) {
            return;
          }
          return this._radiance = value;
        }
      },
      simulate: {
        get: function() {
          return this._simulate;
        },
        set: function(value) {
          if (this._simulate === value) {
            return;
          }
          this._simulate = value;
          return this.updateLight();
        }
      },
      geometry: {
        get: function() {
          return this._geometry;
        },
        set: function(value) {
          var bb, va;
          if (this._geometry === value || !value) {
            return;
          }
          this._geometry = value;
          if (this.geometryMesh) {
            this.remove(this.geometryMesh);
          }
          if (!this._geometry.boundingBox) {
            this._geometry.computeBoundingBox();
          }
          bb = this._geometry.boundingBox.size();
          va = 0;
          this.planar = true;
          if (bb.x === 0) {
            va = bb.y * bb.z;
            this.planarDirection.set(1, 0, 0);
          } else if (bb.y === 0) {
            va = bb.x * bb.z;
            this.planarDirection.set(0, 1, 0);
          } else if (bb.z === 0) {
            va = bb.x * bb.y;
            this.planarDirection.set(0, 0, 1);
          } else {
            va = bb.x * bb.y * bb.z;
            this.planar = false;
          }
          if (this.planar) {
            this.toIntensity = va * 0.00001;
          } else {
            this.toIntensity = va / 1000000;
          }
          this.updateLight();
          this.geometryMesh = new THREE.Mesh(this._geometry, this.markerMaterial);
          this.add(this.geometryMesh);
          return this.geometryMesh.name = "GEOMETRY MESH";
        }
      }
    });

    AreaLight.prototype.updateLight = function() {
      if (!this._simulate && this.light) {
        this.remove(this.light);
      } else if (!this._simulate) {

      } else if (this._simulate && !this.light) {
        if (this.planar) {
          this.light = new THREE.DirectionalLight(this._color, 1);
          this.light.position.set(0, 0, 0);
          this.light.target.position.copy(this.planarDirection);
        } else {
          this.light = new THREE.PointLight(this._color, 1);
        }
        return this.add(this.light);
      } else if (this.planar && this.light instanceof THREE.PointLight) {
        this.remove(this.light);
        this.light = new THREE.DirectionalLight(this._color, 1);
        this.light.position.set(0, 0, 0);
        this.light.target.position.copy(this.planarDirection);
        return this.add(this.light);
      } else if (!this.planar && this.light instanceof THREE.DirectionalLight) {
        this.remove(this.light);
        this.light = new THREE.PointLight(this._color, 1);
        return this.add(this.light);
      }
    };

    return AreaLight;

  })();

  /*
  
  params :
    # both
    color: 0xffffff
  
    # three.js ( PointLight )
    intensity: 1
    distance: 0
  
    # threeflow / sunflow
    power: 100.0
    simulate: true
    markers: true
    markerSize: 1
  */


  THREEFLOW.PointLight = PointLight = (function() {
    function PointLight(params) {
      var geometry, markerSize, material;
      if (params == null) {
        params = {};
      }
      THREE.Object3D.call(this);
      this._tf_noTraverse = true;
      if (params.simulate !== false) {
        this.simulate = true;
      }
      if (params.markers !== false) {
        this.markers = true;
      }
      this._color = new THREE.Color(params.color);
      this._power = params.power || 100.0;
      if (this.markers) {
        markerSize = params.markerSize || 1;
        geometry = new THREE.SphereGeometry(markerSize, 3, 3);
        material = new THREE.MeshBasicMaterial({
          wireframe: true
        });
        material.color = this._color;
        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);
      }
      if (this.simulate) {
        this.light = new THREE.PointLight(params.color, params.intensity, params.distance);
        this.light.color = this._color;
        this.add(this.light);
      }
    }

    PointLight.prototype = Object.create(THREE.Object3D.prototype);

    Object.defineProperties(PointLight.prototype, {
      color: {
        get: function() {
          return this._color;
        },
        set: function(value) {
          return this._color = value;
        }
      },
      power: {
        get: function() {
          return this._power;
        },
        set: function(value) {
          return this._power = value;
        }
      }
    });

    return PointLight;

  })();

  THREEFLOW.SunskyLight = SunskyLight = (function() {
    function SunskyLight(params) {
      THREE.Object3D.call(this);
      this._tf_noTraverse = true;
      params = params || {};
      this.up = params.up || new THREE.Vector3(0, 1, 0);
      this.east = params.east || new THREE.Vector3(0, 0, 1);
      this.direction = params.direction || new THREE.Vector3(1, 1, 1);
      this.turbidity = params.turbidity || 2;
      this.samples = params.samples || 32;
      if (params.simulate !== false) {
        params.simulate = true;
      }
      if (params.dirLight !== false) {
        params.dirLight = true;
      }
      if (params.hemLight !== false) {
        params.hemLight = true;
      }
      if (params.simulate) {
        if (params.dirLight) {
          this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
          this.add(this.dirLight);
        }
        if (params.hemLight) {
          this.hemLight = new THREE.HemisphereLight(0xffffff, 0x333333, .8);
          this.add(this.hemLight);
        }
      }
    }

    SunskyLight.prototype = Object.create(THREE.Object3D.prototype);

    return SunskyLight;

  })();

  THREEFLOW.ConstantMaterial = ConstantMaterial = (function() {
    function ConstantMaterial(params) {
      if (params == null) {
        params = {};
      }
      if (params.color === void 0) {
        params.color = 0xffffff;
      }
      THREE.MeshLambertMaterial.call(this);
      this.setValues(params);
    }

    ConstantMaterial.prototype = Object.create(THREE.MeshLambertMaterial.prototype);

    return ConstantMaterial;

  })();

  THREEFLOW.DiffuseMaterial = DiffuseMaterial = (function() {
    function DiffuseMaterial(params) {
      if (params == null) {
        params = {};
      }
      if (params.color === void 0) {
        params.color = 0xffffff;
      }
      THREE.MeshPhongMaterial.call(this);
      this.setValues(params);
    }

    DiffuseMaterial.prototype = Object.create(THREE.MeshPhongMaterial.prototype);

    return DiffuseMaterial;

  })();

  THREEFLOW.GlassMaterial = GlassMaterial = (function() {
    function GlassMaterial(params) {
      if (params == null) {
        params = {};
      }
      if (params.color === void 0) {
        params.color = 0xffffff;
      }
      if (params.eta === void 0) {
        params.eta = 1.0;
      }
      this.eta = params.eta;
      /*
      # No support yet
      @absorptionDistance = params.absorptionDistance || 5.0
      
      if typeof params.absorptionColor is THREE.Color
        @absorptionColor = params.absorptionColor
      else if typeof params.absorptionColor is 'number'
        @absorptionColor = new THREE.Color( params.absorptionColor )
      else
        @absorptionColor = new THREE.Color( 0xffffff )
      */

      THREE.MeshPhongMaterial.call(this);
      this.setValues(params);
    }

    GlassMaterial.prototype = Object.create(THREE.MeshPhongMaterial.prototype);

    return GlassMaterial;

  })();

  THREEFLOW.MirrorMaterial = MirrorMaterial = (function() {
    function MirrorMaterial(params) {
      if (params == null) {
        params = {};
      }
      if (params.reflection === void 0 && params.color === void 0) {
        params.color = 0xffffff;
      } else if (params.reflection === void 0) {
        params.color = params.color;
      } else if (params.color === void 0) {
        params.color = params.reflection;
      } else {
        params.color = 0xffffff;
      }
      THREE.MeshPhongMaterial.call(this);
      this.setValues(params);
      this.reflection = this.color;
    }

    MirrorMaterial.prototype = Object.create(THREE.MeshPhongMaterial.prototype);

    return MirrorMaterial;

  })();

  THREEFLOW.PhongMaterial = PhongMaterial = (function() {
    function PhongMaterial(params) {
      if (params == null) {
        params = {};
      }
      if (params.color === void 0) {
        params.color = 0xffffff;
      }
      if (params.power === void 0) {
        this.power = 100;
      }
      if (params.samples === void 0) {
        this.samples = 4;
      }
      THREE.MeshPhongMaterial.call(this);
      this.setValues(params);
    }

    PhongMaterial.prototype = Object.create(THREE.MeshPhongMaterial.prototype);

    return PhongMaterial;

  })();

  THREEFLOW.ShinyMaterial = ShinyMaterial = (function() {
    function ShinyMaterial(params) {
      if (params == null) {
        params = {};
      }
      if (params.color === void 0) {
        params.color = 0xffffff;
      }
      if (params.reflection === void 0) {
        params.reflection = 0.5;
      }
      this.reflection = params.reflection;
      THREE.MeshPhongMaterial.call(this);
      this.setValues(params);
    }

    ShinyMaterial.prototype = Object.create(THREE.MeshPhongMaterial.prototype);

    return ShinyMaterial;

  })();

  THREEFLOW.LightingRig = LightingRig = (function() {
    function LightingRig(camera, domElement) {
      var params;
      this.camera = camera;
      this.domElement = domElement;
      this.onKeyDown = __bind(this.onKeyDown, this);
      this.onPointerUp = __bind(this.onPointerUp, this);
      this.onPointerDown = __bind(this.onPointerDown, this);
      this.onTransformChange = __bind(this.onTransformChange, this);
      THREE.Object3D.call(this);
      params = {};
      params.backdropWall = params.backdropWall || 600;
      params.backdropFloor = params.backdropFloor || 1500;
      params.backdropCurve = params.backdropCurve || 400;
      params.backdropCurveSteps = params.backdropCurveSteps || 20;
      params.backdropMaterial = params.backdropMaterial || new THREEFLOW.DiffuseMaterial({
        color: 0xefefef,
        ambient: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      this.backdropMaterial = params.backdropMaterial;
      this.createBackdrop(params.backdropWall, params.backdropFloor, params.backdropCurve, params.backdropCurveSteps, params.backdropMaterial);
      this.ambient = new THREE.AmbientLight(0x333333);
      this.add(this.ambient);
      this._keyRadiance = 5.5;
      this.lights = [
        new THREEFLOW.LightingRigLight(this, true, {
          name: "Key Light",
          light: {
            color: 0xffffef,
            geometryType: "Plane",
            radiance: this._keyRadiance
          }
        }), new THREEFLOW.LightingRigLight(this, false, {
          enabled: false,
          name: "Fill Light",
          light: {
            color: 0xffffef,
            geometryType: "Plane",
            simulate: false
          }
        }), new THREEFLOW.LightingRigLight(this, false, {
          enabled: false,
          name: "Back/Rim Light",
          light: {
            color: 0xffffef,
            geometryType: "Plane",
            simulate: false
          }
        }), new THREEFLOW.LightingRigLight(this, false, {
          enabled: false,
          name: "Background Light",
          light: {
            color: 0xffffef,
            geometryType: "Plane",
            simulate: false
          }
        })
      ];
      this.projector = new THREE.Projector();
      this.raycaster = new THREE.Raycaster();
      this.pointerVec = new THREE.Vector3();
      this.domElement.addEventListener("mousedown", this.onPointerDown, false);
      this.domElement.addEventListener("mouseup", this.onPointerUp, false);
      window.addEventListener("keydown", this.onKeyDown, false);
      this.transformControls = new THREE.TransformControls(this.camera, this.domElement);
      this.transformControls.addEventListener("change", this.onTransformChange);
      this.orbitControls = new THREE.OrbitControls(this.camera, this.domElement);
      this.transformControls._tf_noIndex = true;
      this.add(this.transformControls);
      this.enabledLights = [];
      this.lightsDirty = true;
      this.keyRadianceDirty = true;
      this.update();
    }

    LightingRig.prototype = Object.create(THREE.Object3D.prototype);

    Object.defineProperties(LightingRig.prototype, {
      keyRadiance: {
        get: function() {
          return this._keyRadiance;
        },
        set: function(value) {
          if (this._keyRadiance === value) {
            return;
          }
          this._keyRadiance = value;
          return this.keyRadianceDirty = true;
        }
      }
    });

    LightingRig.prototype.onTransformChange = function(event) {
      var light, _i, _len, _ref;
      if ((event.state === "pointer-down" || event.state === "pointer-hover") && this.orbitControls.enabled) {
        this.orbitControls.enabled = false;
      } else if (event.state === "pointer-up" && !this.orbitControls.enabled) {
        this.orbitControls.enabled = true;
      }
      _ref = this.enabledLights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        light = _ref[_i];
        light.lookAtDirty = true;
      }
      return this.transformControls.update();
    };

    LightingRig.prototype.onPointerDown = function(event) {
      event.preventDefault();
      /*
      intersect = @getIntersection()
      
      if intersect
        @orbitControls.enabled = false
      else
        @orbitControls.enabled = true
      */

      return null;
    };

    LightingRig.prototype.saveState = function() {
      var l, light, state, _i, _len, _ref;
      state = {};
      state.lights = [];
      _ref = this.lights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        light = _ref[_i];
        l = {};
        l.enabled = light.enabled;
        l.color = light.color;
        l.radiance = light.radiance;
        l.geometryType = light.geometryType;
        l.target = {};
        l.target.x = light.targetMesh.position.x;
        l.target.y = light.targetMesh.position.y;
        l.target.z = light.targetMesh.position.z;
        l.light = {};
        l.light.x = light.light.position.x;
        l.light.y = light.light.position.y;
        l.light.z = light.light.position.z;
        l.light.sx = light.light.scale.x;
        l.light.sy = light.light.scale.y;
        l.light.sz = light.light.scale.z;
        state.lights.push(l);
      }
      state.camera = {};
      state.camera.x = this.camera.position.x;
      state.camera.y = this.camera.position.y;
      state.camera.z = this.camera.position.z;
      state.camera.rx = this.camera.rotation.x;
      state.camera.rx = this.camera.rotation.y;
      state.camera.rz = this.camera.rotation.z;
      state.camera.ord = this.camera.rotation.order;
      state.orbit = {};
      state.orbit.x = this.orbitControls.target.x;
      state.orbit.y = this.orbitControls.target.y;
      state.orbit.z = this.orbitControls.target.z;
      return state;
    };

    LightingRig.prototype.loadState = function(state) {
      var i, light, _i, _len, _ref;
      if (typeof state === "string") {
        state = JSON.parse(state);
      }
      this.keyRadiance = state.keyRadiance;
      _ref = state.lights;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        light = _ref[i];
        this.lights[i].enabled = light.enabled;
        this.lights[i].color = light.color;
        this.lights[i].radiance = light.radiance;
        this.lights[i].geometryType = light.geometryType;
        this.lights[i].targetMesh.position.set(light.target.x, light.target.y, light.target.z);
        this.lights[i].light.position.set(light.light.x, light.light.y, light.light.z);
        this.lights[i].light.scale.set(light.light.sx, light.light.sy, light.light.sz);
        this.lights[i].lookAtDirty = true;
      }
      if (state.camera) {
        this.camera.position.set(state.camera.x, state.camera.y, state.camera.z);
        this.camera.rotation.set(state.camera.rx, state.camera.ry, state.camera.rz, state.camera.ord);
      }
      if (state.orbit) {
        this.orbitControls.target.x = state.orbit.x;
        this.orbitControls.target.y = state.orbit.y;
        this.orbitControls.target.z = state.orbit.z;
        this.orbitControls.update();
      }
      return null;
    };

    LightingRig.prototype.onPointerUp = function(event) {
      var intersect;
      event.preventDefault();
      intersect = this.getIntersection();
      if (intersect) {
        this.orbitControls.enabled = false;
        if (intersect.object.parent instanceof THREEFLOW.AreaLight) {
          this.transformControls.attach(intersect.object.parent);
        } else if (intersect.object.parent instanceof THREEFLOW.LightingRigLight) {
          this.transformControls.attach(intersect.object);
        }
        this.transformControls.setMode("translate");
      } else {
        this.transformControls.detach(this.transformControls.object);
      }
      return null;
    };

    LightingRig.prototype.getIntersection = function() {
      var intersect, intersects, light, objects, rect, x, y, _i, _len, _ref;
      rect = this.domElement.getBoundingClientRect();
      x = (event.clientX - rect.left) / rect.width;
      y = (event.clientY - rect.top) / rect.height;
      this.pointerVec.set(x * 2 - 1, -y * 2 + 1, 1);
      this.projector.unprojectVector(this.pointerVec, this.camera);
      this.raycaster.set(this.camera.position, this.pointerVec.sub(this.camera.position).normalize());
      objects = [];
      _ref = this.enabledLights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        light = _ref[_i];
        objects.push(light.light.geometryMesh, light.targetMesh);
      }
      intersects = this.raycaster.intersectObjects(objects, true);
      intersect = null;
      if (intersects.length) {
        intersect = intersects[0];
      }
      return intersect;
    };

    LightingRig.prototype.onKeyDown = function(event) {
      var object;
      object = this.transformControls.object;
      if (!object) {
        return;
      }
      if (object instanceof THREEFLOW.AreaLight) {
        switch (event.keyCode) {
          case 81:
            this.transformControls.setSpace(this.transformControls.space === "local" ? "world" : "local");
            break;
          case 87:
            this.transformControls.setMode("translate");
            break;
          case 82:
            this.transformControls.setMode("scale");
        }
      } else if (object.parent instanceof THREEFLOW.LightingRigLight) {
        switch (event.keyCode) {
          case 81:
            this.transformControls.setSpace(this.transformControls.space === "local" ? "world" : "local");
            break;
          case 87:
            this.transformControls.setMode("translate");
        }
      }
      return null;
    };

    LightingRig.prototype.update = function() {
      var light, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      if (this.lightsDirty) {
        this.lightsDirty = false;
        _ref = this.enabledLights;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          light = _ref[_i];
          if (light.parent) {
            this.remove(light);
          }
        }
        this.enabledLights.splice(0);
        _ref1 = this.lights;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          light = _ref1[_j];
          if (light.enabled) {
            this.add(light);
            this.enabledLights.push(light);
          }
        }
      }
      /*
      if @keyRadianceDirty
        @keyRadianceDirty = false
        for light in @lights
          if light.keyRatio
            light.radiance = @keyRadiance / light.keyRatio
      
          if light.isKey
            light.light.radiance = @keyRadiance
      */

      this.orbitControls.update();
      this.transformControls.update();
      _ref2 = this.enabledLights;
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        light = _ref2[_k];
        _results.push(light.update());
      }
      return _results;
    };

    LightingRig.prototype.createBackdrop = function(wall, floor, curve, curveSteps, material) {
      var PI2, angle, geometry, mesh, points, x, z, _i, _ref, _ref1, _ref2;
      points = [];
      points.push(new THREE.Vector3());
      PI2 = Math.PI / 2;
      for (angle = _i = _ref = Math.PI, _ref1 = Math.PI - PI2, _ref2 = -(PI2 / curveSteps); _ref2 > 0 ? _i < _ref1 : _i > _ref1; angle = _i += _ref2) {
        x = (Math.sin(angle) * curve) + floor;
        z = (Math.cos(angle) * curve) + curve;
        points.push(new THREE.Vector3(x, 0, z));
      }
      points.push(new THREE.Vector3(floor + curve, 0, curve + wall));
      geometry = new THREE.LatheGeometry(points, 12, 0, Math.PI);
      mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -(Math.PI / 2);
      mesh.position.z = floor / 2;
      this.add(mesh);
      return null;
    };

    return LightingRig;

  })();

  /*
  # parameter options.
  rig = new THREEFLOW.LightingRigLight
    target: target.position
    rotateX: 90
    rotateY: 0
    rotateZ: 0
    distance: 400
    color: 0xff0000 # shorthand for light color
    light: new THREEFLOW.AreaLight
      color: 0xffffff
      geometry: new THREE.SphereGeometry()
    bounce:
      rotateX:-90
      distance: 50
      color: 0xffffff # another shorthand for material color
      material: new THREEFLOW.ShinyMaterial
        color: 0xff0000
      geometry: new THREE.PlaneGeometry()
  */


  THREEFLOW.LightingRigLight = LightingRigLight = (function() {
    LightingRigLight.LIGHT_GEOMETRY_TYPES = ["Plane", "Circle", "Box", "Sphere", "Ring"];

    LightingRigLight.DEFAULT_LIGHT_GEOMETRY_TYPE = "Circle";

    function LightingRigLight(rig, isKey, params) {
      var geometry, lightParams, targetMaterial;
      this.rig = rig;
      this.isKey = isKey;
      if (params == null) {
        params = {};
      }
      THREE.Object3D.call(this);
      this.name = params.name || "RigLight";
      if (typeof params.enabled === "boolean") {
        this._enabled = params.enabled;
      } else {
        this._enabled = true;
      }
      targetMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
      });
      geometry = new THREE.BoxGeometry(30, 30, 30);
      this.targetMesh = new THREE.Mesh(geometry, targetMaterial);
      this.targetMesh.position.set(0, 15, 0);
      this.targetMesh._tf_noIndex = true;
      this.add(this.targetMesh);
      this.target = this.targetMesh.position;
      this._keyRatio = 0;
      this.lightGeomPlane = null;
      this.lightGeomCircle = null;
      this.lightGeomBox = null;
      this.lightGeomSphere = null;
      this.lightGeomRing = null;
      lightParams = params.light || {};
      if (lightParams.geometryType) {
        this._geometryType = lightParams.geometryType;
      } else {
        this._geometryType = THREEFLOW.LightingRigLight.DEFAULT_LIGHT_GEOMETRY_TYPE;
      }
      lightParams.geometry = this.getGeometry(this._geometryType);
      this.light = new THREEFLOW.AreaLight(lightParams);
      this.light.position.set(0, 0, -100);
      this.add(this.light);
      this.lookAtDirty = true;
      /*
      @_pitchPhi = params.pitch || 0
      @_yawTheta = params.yaw || 0
      @_distance = params.distance || 500
      
      @rotateDirty = true
      */

      /*
      params.bounce = params.bounce || null
      params.bounce = {} if typeof(params.bounce) is "boolean"
      
      if params.bounce
      
        @bouncePitchPhi = params.bounce.pitch || 0
        @bounceYawTheta = params.bounce.yaw || 0
      
        material = params.bounce.material || new THREEFLOW.DiffuseMaterial
          color: params.bounce.color
      
        geometry = params.bounce.geometry || new THREE.PlaneGeometry()
      
        @bounce = new THREE.Mesh geometry,material
        @add @bounce
      
        @bounceDirty = true
      */

      this.update();
    }

    LightingRigLight.prototype = Object.create(THREE.Object3D.prototype);

    Object.defineProperties(LightingRigLight.prototype, {
      /*
      yaw:
        get: ->
          @_yawTheta
        set: (value) ->
          if @_yawTheta is value
            return
      
          @_yawTheta = value
          @rotateDirty = true
      pitch:
        get: ->
          @_pitchPhi
        set: (value) ->
          if @_pitchPhi is value
            return
      
          @_pitchPhi = value
          @rotateDirty = true
      distance:
        get: ->
          @_distance
        set: (value) ->
          if @_distance is value
            return
      
          @_distance = value
          @rotateDirty = true
      */

      color: {
        get: function() {
          return this.light.color.getHex();
        },
        set: function(value) {
          return this.light.color.setHex(value);
        }
      },
      radiance: {
        get: function() {
          return this.light.radiance;
        },
        set: function(value) {
          if (this.light.radiance === value) {
            return;
          }
          if (this.isKey) {
            this.rig.keyRadiance = value;
          }
          return this.light.radiance = value;
        }
      },
      keyRatio: {
        get: function() {
          return this._keyRatio;
        },
        set: function(value) {
          if (!this.isKey) {
            this.rig.keyRadianceDirty = true;
            return this._keyRatio = value;
          }
        }
      },
      geometryType: {
        get: function() {
          return this._geometryType;
        },
        set: function(value) {
          var geometry;
          if (this._geometryType === value) {
            return;
          }
          geometry = this.getGeometry(value);
          if (geometry) {
            return this.light.geometry = geometry;
          }
        }
      },
      enabled: {
        get: function() {
          return this._enabled;
        },
        set: function(value) {
          this._enabled = value;
          if (this.rig) {
            return this.rig.lightsDirty = true;
          }
        }
      }
    });

    LightingRigLight.prototype.update = function() {
      /*
      if @rotateDirty
        @rotateDirty = false
      
        @light.position.x = @_distance * Math.sin(@_pitchPhi) * Math.cos(@_yawTheta)
        @light.position.y = @_distance * Math.cos(@_pitchPhi)
        @light.position.z = @_distance * Math.sin(@_pitchPhi) * Math.sin(@_yawTheta)
      
        @light.lookAt @target
      
        @bounceDirty = true
      */

      if (this.lookAtDirty) {
        this.lookAtDirty = false;
        this.light.lookAt(this.target);
      }
      if (this.bounceDirty) {
        this.bounceDirty = false;
      }
      return null;
    };

    LightingRigLight.prototype.getGeometry = function(type) {
      var geometry;
      geometry = null;
      switch (type) {
        case "Plane":
          if (this.lightGeomPlane === null) {
            geometry = this.lightGeomPlane = new THREE.PlaneGeometry(400, 400);
          }
          break;
        case "Circle":
          if (this.lightGeomCircle === null) {
            geometry = this.lightGeomCircle = new THREE.CircleGeometry(200, 12);
          }
          break;
        case "Box":
          if (this.lightGeomBox === null) {
            geometry = this.lightGeomBox = new THREE.BoxGeometry(200, 200, 200);
          }
          break;
        case "Sphere":
          if (this.lightGeomSphere === null) {
            geometry = this.lightGeomSphere = new THREE.SphereGeometry(200);
          }
          break;
        case "Ring":
          if (this.lightGeomRing === null) {
            geometry = this.lightGeomRing = new THREE.RingGeometry(100, 200, 12, 12);
          }
      }
      return geometry;
    };

    return LightingRigLight;

  })();

  Log = (function() {
    function Log() {
      this.warn = __bind(this.warn, this);
      this.log = __bind(this.log, this);
      this.setEnabled = __bind(this.setEnabled, this);
      this.enabled = true;
      if (!window.console) {
        window.console = {};
      }
      if (!window.console.log) {
        window.console.log = function() {
          return null;
        };
      }
    }

    Log.prototype.setEnabled = function(value) {
      this.enabled = value;
      return null;
    };

    Log.prototype.args = function(args) {
      return Array.prototype.slice.call(args, 0);
    };

    Log.prototype.log = function() {
      if (this.enabled) {
        console.log.apply(console, ["[Threeflow]"].concat(this.args(arguments)));
      }
      return null;
    };

    Log.prototype.warn = function() {
      if (this.enabled) {
        console.log.apply(console, ["[Threeflow]", "!!!"].concat(this.args(arguments)));
      }
      return null;
    };

    return Log;

  })();

  THREEFLOW.__log = new Log();

  THREEFLOW.log = THREEFLOW.__log.log;

  THREEFLOW.warn = THREEFLOW.__log.warn;

  THREEFLOW.Signal = Signal = (function() {
    function Signal() {
      this.listeners = null;
    }

    Signal.prototype.add = function(listener) {
      if (typeof listener !== "function") {
        false;
      }
      if (!this.listeners) {
        this.listeners = [];
      }
      if (this.listeners.indexOf(listener) !== -1) {
        return false;
      } else {
        this.listeners.push(listener);
        return true;
      }
    };

    Signal.prototype.remove = function(listener) {
      var idx;
      if (!this.listeners) {
        false;
      }
      idx = this.listeners.indexOf(listener);
      if (idx === -1) {
        return false;
      } else {
        this.listeners.splice(idx, 1);
        return true;
      }
    };

    Signal.prototype.removeAll = function() {
      this.listeners.splice(0);
      return null;
    };

    Signal.prototype.dispatch = function(event) {
      var listener, _i, _len, _ref;
      if (!this.listeners) {
        return null;
      }
      _ref = this.listeners;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        listener(event);
      }
      return null;
    };

    return Signal;

  })();

}).call(this);
