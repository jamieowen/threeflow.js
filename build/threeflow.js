(function() {
  var AreaLight, BlockExporter, BucketExporter, BufferGeometryExporter, CameraExporter, CausticsExporter, ConstantMaterial, DiffuseMaterial, Exporter, GeometryExporter, GiExporter, GlassMaterial, Gui, ImageExporter, LightingRig, LightingRigLight, LightsExporter, MaterialsExporter, MeshExporter, MirrorMaterial, PhongMaterial, PointLight, ShinyMaterial, Signal, SunflowRenderer, SunskyLight, TraceDepthsExporter,
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
        this.exporter.image.resolutionX = this.width * this.scale;
        this.exporter.image.resolutionY = this.height * this.scale;
        this.exporter.camera.camera = camera;
        this.exporter.indexScene(scene);
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
        console.log("[Render in Progress]");
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
      console.log("THREEFLOW " + THREEFLOW.VERSION + " [Connected]");
      this.connected = true;
      this.rendering = false;
      this.setConnectionStatus(SunflowRenderer.CONNECTED);
      return null;
    };

    SunflowRenderer.prototype.onDisconnected = function(data) {
      console.log("THREEFLOW " + THREEFLOW.VERSION + " [Disconnected]");
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

  THREEFLOW.VERSION = '0.6.0-1';

  THREEFLOW.COMMIT = '5189dd8';

  BlockExporter = (function() {
    function BlockExporter(exporter) {
      this.exporter = exporter;
    }

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
      this.bufferGeometryIndex = {};
    }

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
      this.materials = this.addBlockExporter(new MaterialsExporter(this));
      this.geometry = this.addBlockExporter(new GeometryExporter(this));
      this.bufferGeometry = this.addBlockExporter(new BufferGeometryExporter(this));
      this.meshes = this.addBlockExporter(new MeshExporter(this));
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
      var blockExporter, child, cls, doTraverse, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      _ref = Exporter.EXCLUDED_OBJECT3D_TYPES;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cls = _ref[_i];
        if (object3d instanceof cls) {
          console.log("[Threeflow] Ignored object : ", object3d);
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

    function GeometryExporter(exporter) {
      GeometryExporter.__super__.constructor.call(this, exporter);
      this.normals = true;
      this.vertexNormals = false;
      this.uvs = false;
      this.geometryIndex = {};
    }

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
      var entry, face, normal, normals, result, uuid, v1, v2, v3, vertex, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4;
      result = '';
      for (uuid in this.geometryIndex) {
        entry = this.geometryIndex[uuid];
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
            console.log("[Threeflow] Problem with geometry normals. ", entry.geometry);
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
          result += '  uvs none\n';
        } else {
          result += '  uvs none\n';
        }
        if (entry.faceMaterials) {
          result += '  face_shaders\n';
          _ref4 = entry.geometry.faces;
          for (_n = 0, _len5 = _ref4.length; _n < _len5; _n++) {
            face = _ref4[_n];
            result += '    ' + face.materialIndex + '\n';
          }
        }
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
      this.lightIndex = {};
    }

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
      if (object3d instanceof THREEFLOW.PointLight) {
        return false;
      } else if (object3d instanceof THREEFLOW.SunskyLight) {
        return false;
      } else if (object3d instanceof THREEFLOW.AreaLight) {
        return false;
      } else {
        return true;
      }
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
      this.materialsIndex = {};
    }

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
        } else {
          console.log("[Threeflow] Unsupported Material type. Will map to black THREEFLOW.DiffuseMaterial");
          console.log(material);
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
      this.meshIndex = {};
    }

    MeshExporter.prototype.addToIndex = function(object3d) {
      if (!(object3d instanceof THREE.Mesh)) {
        return;
      }
      if (object3d instanceof THREE.VertexNormalsHelper) {
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
        }
        result += '}\n\n';
      }
      return result;
    };

    return MeshExporter;

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
        folder.add(rigLight, "keyRatio", 0, 16);
        folder.add(rigLight, "radiance", 0, 100).listen();
      }
      folder.addColor(rigLight, "color").onChange(function(value) {
        var hex;
        hex = parseInt(value, 16);
        return console.log(hex);
      });
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
      var lineGeometry;
      if (params == null) {
        params = {};
      }
      THREE.Object3D.call(this);
      if (params.simulate !== false) {
        this.simulate = true;
      }
      if (params.markers !== false) {
        this.markers = true;
      }
      this._color = new THREE.Color(params.color);
      this._radiance = params.radiance || 100.0;
      this.samples = params.samples || 16;
      this._geometry = params.geometry || new THREE.PlaneGeometry(10, 10);
      if (this.markers) {
        this.material = new THREE.MeshBasicMaterial({
          wireframe: true
        });
        this.material.color = this._color;
        this.mesh = new THREE.Mesh(this._geometry, this.material);
        this.add(this.mesh);
        lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, 100));
        this.line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
          color: this._color.getHex()
        }));
        this.add(this.line);
      }
      if (this.simulate) {
        this.light = new THREE.PointLight(params.color, params.intensity);
        this.light.color = this._color;
        this.add(this.light);
      }
    }

    AreaLight.prototype = Object.create(THREE.Object3D.prototype);

    Object.defineProperties(AreaLight.prototype, {
      color: {
        get: function() {
          return this._color;
        },
        set: function(value) {
          return this._color = value;
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
      geometry: {
        get: function() {
          return this._geometry;
        },
        set: function(value) {
          if (this._geometry === value) {
            return;
          }
          this._geometry = value;
          this.remove(this.mesh);
          this.mesh = new THREE.Mesh(this._geometry, this.material);
          return this.add(this.mesh);
        }
      }
    });

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
      THREE.MeshBasicMaterial.call(this);
      this.setValues(params);
    }

    ConstantMaterial.prototype = Object.create(THREE.MeshBasicMaterial.prototype);

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
      THREE.MeshLambertMaterial.call(this);
      this.setValues(params);
    }

    DiffuseMaterial.prototype = Object.create(THREE.MeshLambertMaterial.prototype);

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
      this.onPointerUp = __bind(this.onPointerUp, this);
      this.onPointerDown = __bind(this.onPointerDown, this);
      this.onTransformChange = __bind(this.onTransformChange, this);
      var light, params, _i, _len, _ref;
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
      this._keyRadiance = 5.5;
      this.lights = [
        new THREEFLOW.LightingRigLight(this, true, {
          name: "Key Light",
          keyRatio: 0,
          light: {
            color: 0xffffef,
            geometryType: "Plane",
            radiance: this.keyRadiance
          }
        }), new THREEFLOW.LightingRigLight(this, false, {
          name: "Fill Light",
          keyRatio: 5,
          light: {
            color: 0xffffef,
            geometryType: "Plane"
          }
        }), new THREEFLOW.LightingRigLight(this, false, {
          name: "Back/Rim Light",
          keyRatio: 2,
          light: {
            color: 0xffffef,
            geometryType: "Plane"
          }
        }), new THREEFLOW.LightingRigLight(this, false, {
          enabled: false,
          name: "Background Light",
          keyRatio: 8,
          light: {
            color: 0xffffef,
            geometryType: "Plane"
          }
        })
      ];
      this.transformControls = new THREE.TransformControls(camera, domElement);
      this.transformControls.addEventListener("change", this.onTransformChange);
      this.orbitControls = new THREE.OrbitControls(camera, domElement);
      this.pointerDown = false;
      domElement.addEventListener("mousedown", this.onPointerDown, false);
      domElement.addEventListener("mouseup", this.onPointerUp, false);
      domElement.addEventListener("mouseout", this.onPointerUp, false);
      this.add(this.transformControls);
      _ref = this.lights;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        light = _ref[_i];
        light.position.set(Math.random() * 500, Math.random() * 500, Math.random() * 500);
      }
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
      if ((event.state === "pointer-down" || event.state === "pointer-hover") && this.orbitControls.enabled) {
        return this.orbitControls.enabled = false;
      } else if (event.state === "pointer-up" && !this.orbitControls.enabled) {
        return this.orbitControls.enabled = true;
      }
    };

    LightingRig.prototype.onPointerDown = function(event) {
      return null;
    };

    LightingRig.prototype.onPointerUp = function(event) {
      return null;
    };

    LightingRig.prototype.update = function() {
      var light, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _results;
      if (this.lightsDirty) {
        this.lightsDirty = false;
        _ref = this.enabledLights;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          light = _ref[_i];
          this.remove(light);
        }
        this.enabledLights.splice(0);
        _ref1 = this.lights;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          light = _ref1[_j];
          if (light.enabled) {
            this.transformControls.attach(light);
            this.add(light);
            this.enabledLights.push(light);
          }
        }
      }
      if (this.keyRadianceDirty) {
        this.keyRadianceDirty = false;
        _ref2 = this.lights;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          light = _ref2[_k];
          if (light.keyRatio) {
            light.radiance = this.keyRadiance / light.keyRatio;
          }
          if (light.isKey) {
            light.light.radiance = this.keyRadiance;
          }
        }
      }
      this.orbitControls.update();
      this.transformControls.update();
      _ref3 = this.enabledLights;
      _results = [];
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        light = _ref3[_l];
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
      var lightParams;
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
      this.target = params.target || new THREE.Vector3();
      this._keyRatio = params.keyRatio || 0;
      /*
      @_pitchPhi = params.pitch || 0
      @_yawTheta = params.yaw || 0
      @_distance = params.distance || 500
      
      @rotateDirty = true
      */

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
      this.add(this.light);
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
