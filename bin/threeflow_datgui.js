(function() {
  var DatGUI, THREEFLOW;

  window.THREEFLOW = window.THREEFLOW || {};

  THREEFLOW = window.THREEFLOW;

  THREEFLOW.DatGui = DatGUI = (function() {
    function DatGUI(renderer) {
      var giSubFolder, property, type, _i, _len, _ref;
      this.renderer = renderer;
      if (!window.dat && !window.dat.GUI) {
        throw new Error("No dat.GUI found.");
      }
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
      this.imageFolder = this.gui.addFolder("Image");
      this.traceDepthsFolder = this.gui.addFolder("Trace Depths");
      this.causticsFolder = this.gui.addFolder("Caustics");
      this.giFolder = this.gui.addFolder("Global Illumination");
      this.meshFolder = this.gui.addFolder("Mesh Options");
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
      this.giFolder.add(this.renderer.gi, "enabled");
      this.giFolder.add(this.renderer.gi, "type", this.renderer.gi.types);
      this.giTypes = [
        {
          type: this.renderer.gi.types[0],
          name: "Instant GI",
          property: "igi"
        }, {
          type: this.renderer.gi.types[1],
          name: "Irradiance Caching (FG)",
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
      this.giSubFolders = [];
      _ref = this.giTypes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        giSubFolder = this.giFolder.addFolder(type.name);
        this.giSubFolders.push(giSubFolder);
        for (property in this.renderer.gi[type.property]) {
          if (type.type === "irr-cache" && property === "globalMap") {
            this.giFolder.add(this.renderer.gi.irrCache, "globalMap", this.renderer.gi.globalMapTypes);
          } else if (type === "ambocc" && (property === "bright" || property === "dark")) {
            this.giFolder.addColor(this.renderer.gi[type.property], property);
          } else if (type.type === "fake") {
            console.log("SKIPPED FAKE AMBIENT TERM GI(TODO)");
          } else {
            this.giFolder.add(this.renderer.gi[type.property], property);
          }
        }
      }
      /*
      for exporter in @renderer.exporter.blockExporters
        if exporter instanceof GiExporter
          folder = @gui.addFolder @folderNameMap[exporter.constructor.name]
          folder.add exporter,'enabled'
          folder.add exporter,'type',GiExporter.TYPES
      
        else
          folder = @gui.addFolder @folderNameMap[exporter.constructor.name]
          for prop of exporter.settings
            if exporter instanceof ImageExporter and prop is "filter"
              folder.add exporter.settings, prop, ImageExporter.FILTERS
            else
              folder.add exporter.settings, prop
      */

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

      null;
    }

    return DatGUI;

  })();

}).call(this);
