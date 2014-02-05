(function() {
  var DatGUI, THREEFLOW;

  window.THREEFLOW = window.THREEFLOW || {};

  THREEFLOW = window.THREEFLOW;

  THREEFLOW.DatGui = DatGUI = (function() {
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
