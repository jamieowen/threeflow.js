var Render, RenderQueue, child_process, fs, log, path,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
    Render.MATCH_PROGRESS = /\[\d{1,2}%\]/;

    Render.MATCH_PROGRESS_INT = /\d{1,2}/;

    Render.MATCH_RENDER_TIME = /Render time: \d*:\d{1,2}:\d{1,2}\.\d*/;

    Render.MATCH_DONE = /Done\./;

    function Render(client, source, options, sunflowCl) {
      var flags, folders, num, renderPath;
      this.client = client;
      this.options = options != null ? options : {};
      this.sunflowCl = sunflowCl != null ? sunflowCl : {};
      this.onProcessData = __bind(this.onProcessData, this);
      this.onProcessClose = __bind(this.onProcessClose, this);
      this.id = this.client.generateRenderID();
      this.status = "queued";
      flags = this.client.server.opts.flags;
      folders = renderPath = this.client.server.opts.folders;
      if (!this.options.name || !flags.allowSave) {
        this.filename = "." + this.id;
      } else if (flags.overwrite) {
        this.filename = this.options.name;
      } else {
        num = this.getSuffixInt(this.options.name, folders.renders);
        this.filename = this.options.name + "-" + num;
      }
      this.writeSource(source, folders.renders);
      this.progress = null;
      this.renderTime = null;
    }

    Render.prototype.getSuffixInt = function(name, renderPath) {
      var filename, files, matchName, matchNum, maxInt, num, _i, _len;
      files = fs.readdirSync(renderPath);
      matchName = new RegExp("^" + name + "-[0-9]*\.((sc)|(png))", "g");
      matchNum = new RegExp("[0-9]+", "g");
      maxInt = 0;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        filename = files[_i];
        matchName.lastIndex = 0;
        if (matchName.test(filename)) {
          matchNum.lastIndex = 0;
          num = matchNum.exec(filename);
          num = parseInt(num[num.length - 1][0], 10);
          if (num > maxInt) {
            maxInt = num;
          }
        }
      }
      return maxInt + 1;
    };

    Render.prototype.writeSource = function(source, renderPath) {
      var writePath;
      writePath = path.join(renderPath, this.filename + ".sc");
      log.info("Writing scene file : " + writePath);
      fs.writeFileSync(writePath, source);
      return null;
    };

    Render.prototype.dispose = function() {
      log.error("Need to handle dispose...");
      return null;
    };

    Render.prototype.cleanUp = function() {
      var flags, renders;
      flags = this.client.server.opts.flags;
      renders = this.client.server.opts.folders.renders;
      log.info("Cleaning up...");
      if ((flags.deleteSc && this.options.deleteSc) || (!flags.deleteSc && this.options.deleteSc)) {
        fs.unlinkSync(path.join(renders, this.filename + ".sc"));
      }
      return null;
    };

    Render.prototype.isComplete = function() {
      return this.status === "complete";
    };

    Render.prototype.render = function() {
      var args, command, flags, renders, sfProcess, sunflow;
      log.info("Starting Sunflow...");
      this.status = "started";
      sunflow = this.client.server.opts.sunflow;
      flags = this.client.server.opts.flags;
      renders = this.client.server.opts.folders.renders;
      command = sunflow.command;
      args = [sunflow.memory].concat(sunflow.args);
      args.push("-jar", sunflow.jar);
      if (this.sunflowCl.noGui) {
        args.push("-no-gui");
      }
      if (this.sunflowCl.ipr) {
        args.push("-ipr");
      }
      if (this.sunflowCl.hiPri) {
        args.push("-hipri");
      }
      if (flags.allowSave) {
        args.push("-o", path.join(renders, this.filename + ".png"));
      }
      args.push(path.join(renders, this.filename + ".sc"));
      sfProcess = child_process.spawn(command, args);
      sfProcess.on("close", this.onProcessClose);
      sfProcess.stderr.on("data", this.onProcessData);
      this.client.socket.emit('render-start', {
        event: 'render-start',
        command: [command].concat(args).join(" ")
      });
      return null;
    };

    Render.prototype.onProcessClose = function(code) {
      if (!code) {
        if (this.isComplete()) {

        } else {
          this.status = "cancelled";
          log.notice("");
          log.notice("Render Cancelled.");
          this.cleanUp();
          if (this.client.connected) {
            this.client.socket.emit('render-cancelled', {
              event: 'render-cancelled',
              data: null
            });
          }
        }
      } else if (this.client.connected) {
        this.client.socket.emit('render-error', {
          event: 'render-error',
          data: code
        });
      }
      return null;
    };

    Render.prototype.onProcessData = function(buffer) {
      var doneMatched, intMatch, progressMatched, time;
      process.stdout.write(buffer);
      progressMatched = Render.MATCH_PROGRESS.exec(buffer);
      if (progressMatched) {
        intMatch = Render.MATCH_PROGRESS_INT.exec(progressMatched[0]);
        this.progress = parseInt(intMatch[0]);
        if (this.client.connected) {
          return this.client.socket.emit('render-progress', {
            event: 'render-progress',
            progress: this.progress
          });
        }
      } else if (!this.isComplete()) {
        if (!this.renderTime) {
          time = Render.MATCH_RENDER_TIME.exec(buffer);
          if (time) {
            this.renderTime = time[0];
          }
        }
        doneMatched = Render.MATCH_DONE.exec(buffer);
        if (doneMatched) {
          this.status = "complete";
          log.notice("");
          log.notice("Render Complete.");
          this.cleanUp();
          if (this.client.connected) {
            return this.client.socket.emit('render-complete', {
              event: 'render-complete',
              time: this.renderTime
            });
          }
        }
      }
    };

    return Render;

  })()
};
