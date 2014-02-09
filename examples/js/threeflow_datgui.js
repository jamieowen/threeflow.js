(function() {
  var DatGUI,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.THREEFLOW = window.THREEFLOW || {};

  THREEFLOW.DatGui = DatGUI = (function() {
    function DatGUI(renderer) {
      var updateFolder, updateType,
        _this = this;
      this.renderer = renderer;
      this._onRender = __bind(this._onRender, this);
      if (!window.dat && !window.dat.GUI) {
        throw new Error("No dat.GUI found.");
      }
      dat.GUI.prototype.removeFolder = function(name) {
        console.log("REMOVE", this, name);
        this.__folders[name].close();
        this.__ul.removeChild(this.__folders[name].li);
        dom.removeClass(this.__folders[name].li, 'folder');
        this.__folders[name] = void 0;
        return this.onResize();
      };
      this.gui = new dat.GUI();
      this.onRender = null;
      this.gui.add(this, "_onRender").name("Render");
      this.imageFolder = this.gui.addFolder("Image");
      this.traceDepthsFolder = this.gui.addFolder("Trace Depths");
      this.causticsFolder = this.gui.addFolder("Caustics");
      this.giFolder = this.gui.addFolder("Global Illumination");
      this.meshFolder = this.gui.addFolder("Mesh Options");
      this.geometryFolder = this.gui.addFolder("Geometry Options");
      this.imageFolder.add(this.renderer.image, "antialiasMin");
      this.imageFolder.add(this.renderer.image, "antialiasMax");
      this.imageFolder.add(this.renderer.image, "samples");
      this.imageFolder.add(this.renderer.image, "contrast");
      this.imageFolder.add(this.renderer.image, "filter", this.renderer.image.filterTypes);
      this.imageFolder.add(this.renderer.image, "jitter");
      this.traceDepthsFolder.add(this.renderer.traceDepths, "enabled");
      this.traceDepthsFolder.add(this.renderer.traceDepths, "diffusion");
      this.traceDepthsFolder.add(this.renderer.traceDepths, "reflection");
      this.traceDepthsFolder.add(this.renderer.traceDepths, "refraction");
      this.causticsFolder.add(this.renderer.caustics, "enabled");
      this.causticsFolder.add(this.renderer.caustics, "photons");
      this.causticsFolder.add(this.renderer.caustics, "kdEstimate");
      this.causticsFolder.add(this.renderer.caustics, "kdRadius");
      this.meshFolder.add(this.renderer.meshes, "convertPrimitives");
      this.geometryFolder.add(this.renderer.geometry, "faceNormals");
      this.geometryFolder.add(this.renderer.geometry, "vertexNormals");
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
        var controller, controllers, property, _i, _len;
        if (!_this.giSubFolder) {
          _this.giSubFolder = _this.giFolder.addFolder(type.name);
        } else {
          controllers = _this.giSubFolder.__controllers.slice(0);
          for (_i = 0, _len = controllers.length; _i < _len; _i++) {
            controller = controllers[_i];
            _this.giSubFolder.remove(controller);
          }
          _this.giSubFolder.__controllers.splice(0);
          _this.giSubFolder.__ul.firstChild.innerHTML = type.name;
        }
        for (property in _this.renderer.gi[type.property]) {
          if (type.type === "irr-cache" && property === "globalMap") {
            _this.giSubFolder.add(_this.renderer.gi.irrCache, "globalMap", _this.renderer.gi.globalMapTypes);
          } else if (type.type === "ambocc" && (property === "bright" || property === "dark")) {
            _this.giSubFolder.addColor(_this.renderer.gi[type.property], property);
          } else if (type.type === "fake") {
            console.log("SKIPPED FAKE AMBIENT TERM GI(TODO)");
          } else {
            _this.giSubFolder.add(_this.renderer.gi[type.property], property);
          }
        }
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

    DatGUI.prototype._onRender = function() {
      if (this.onRender) {
        return this.onRender();
      }
    };

    /*
    _onPreview:()=>
      if @onPreview
        @onPreview()
    */


    return DatGUI;

  })();

}).call(this);
