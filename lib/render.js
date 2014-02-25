var Render, RenderQueue, child_process, fs, log, path;

path = require('path');

child_process = require('child_process');

fs = require('fs');

log = require('./log');

module.exports = {
  createRender: function(client, source, options, sunflow_cl) {
    var render;
    render = new Render(client, source, options, sunflow_cl);
    return render;
  },
  createQueue: function(server) {
    var queue;
    queue = new RenderQueue(server);
    return queue;
  },
  RenderQueue: RenderQueue = (function() {
    function RenderQueue(server) {
      this.server = server;
      this.renders = [];
    }

    RenderQueue.prototype.add = function(render) {
      this.renders.push(render);
      return null;
    };

    RenderQueue.prototype.remove = function(render) {
      var idx;
      idx = this.renders.indexOf(render);
      this.renders.splice(idx, 1);
      return null;
    };

    RenderQueue.prototype.removeAllByClient = function(client) {
      var i, render;
      i = this.renders.length;
      while (i) {
        render = this.renders[i];
        if (render.client.id === client.id) {
          this.renders.splice(i, 1);
          render.dispose();
        }
        i--;
      }
      return null;
    };

    RenderQueue.prototype.process = function() {
      var render;
      if (this.renders.length) {
        render = this.renders.pop();
        if (render.status !== "error") {
          render.render();
        } else {
          this.process();
        }
      }
      return null;
    };

    return RenderQueue;

  })(),
  Render: Render = (function() {
    function Render(client, source, options, sunflow_cl) {
      this.client = client;
      if (options == null) {
        options = {};
      }
      if (sunflow_cl == null) {
        sunflow_cl = {};
      }
      this.id = this.client.generateRenderID();
      if (!source) {
        this.status = "error";
        this.message = "No scene source given.";
      } else {
        this.status = "queued";
        this.message = "Queued";
        this.writeSource(options.name, source);
      }
    }

    Render.prototype.writeSource = function(name, source) {
      var filename, server;
      if (!name) {
        filename = ".tmp.render.sc";
      } else {
        filename = name + ".sc";
      }
      server = this.client.server;
      path = path.join(server.opts.folders.renders, filename);
      log.info("Writing scene file: " + path);
      return fs.writeFileSync(path);
    };

    Render.prototype.dispose = function() {};

    Render.prototype.render = function() {
      return console.log("start rendering.....");
    };

    return Render;

  })()
};
