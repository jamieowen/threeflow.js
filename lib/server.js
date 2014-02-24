var ThreeflowServer, express, fs, http, io, log, path, render, version,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

express = require('express');

io = require('socket.io');

http = require('http');

path = require('path');

fs = require('fs');

log = require('./log');

version = require('./version');

render = require('./render');

module.exports = {
  create: function() {
    var instance;
    log.clear();
    instance = new this.ThreeflowServer();
    return instance;
  },
  ThreeflowServer: ThreeflowServer = (function() {
    function ThreeflowServer() {
      this.onRender = __bind(this.onRender, this);
      this.onConnection = __bind(this.onConnection, this);
      log.notice("[ THREEFLOW " + version.number + " ]");
      this.opts = null;
      this.app = null;
      this.server = null;
      this.io = null;
    }

    ThreeflowServer.prototype.javaDetect = function() {
      return true;
    };

    ThreeflowServer.prototype.defaults = function() {
      var opts;
      opts = {
        server: {
          port: 3710,
          debug: false
        },
        sunflow: {
          version: "-version",
          command: "java",
          jar: path.join(__dirname, "../sunflow/sunflow.jar"),
          args: ["-Xmx1G", "-server"]
        },
        flags: {
          multipleRenders: false,
          allowSave: false,
          allowQueue: false
        },
        folders: {
          serve: "/examples",
          renders: "/examples/renders",
          textures: "/examples/textures",
          models: "/examples/models",
          hdr: "/hdr",
          bakes: "/bakes"
        }
      };
      return opts;
    };

    ThreeflowServer.prototype.options = function(options) {
      var opt;
      if (options == null) {
        options = {};
      }
      this.opts = defaults();
      for (opt in options.server) {
        this.opts.server[opt] = options[opt];
      }
      for (opt in options.flags) {
        this.opts.flags[opt] = options[opt];
      }
      for (opt in options.folders) {
        this.opts.folders[opt] = options[opt];
      }
      return null;
    };

    ThreeflowServer.prototype.optionsJSON = function(cwd) {
      var error, jsonOpts, jsonPath;
      try {
        log.info("Looking for config...");
        jsonPath = path.join(path, "threeflow.json");
        jsonOpts = JSON.parse(fs.readFileSync(jsonPath));
        this.options(jsonOpts);
        this.setCwd(cwd);
        log.info("Using " + jsonPath);
      } catch (_error) {
        error = _error;
        this.setCwd(null);
        log.warn("No config found.  Use 'threeflow init' to start a project.");
      }
      return null;
    };

    ThreeflowServer.prototype.setCwd = function(cwd) {
      return this.cwd = cwd;
    };

    ThreeflowServer.prototype.startup = function() {
      if (!this.opts) {
        this.opts = this.defaults();
      }
      if (!this.cwd) {
        log.notice("Starting up without config. [Renders won't be saved]");
        this.cwd = path.join(__dirname, "..");
      } else {
        log.notice("Starting up with config.");
      }
      this.app = express();
      this.server = http.createServer(this.app);
      this.io = io.listen(this.server, {
        log: this.opts.server.debug
      });
      this.io.sockets.on('connection', this.onConnection);
      this.io.sockets.on('disconnect', this.onDisconnect);
      this.server.listen(this.opts.server.port);
      log.info("Listening on localhost:" + this.opts.server.port);
      this.app.use('/', express["static"](path.join(this.cwd, this.opts.folders.serve)));
      log.info("Serving " + this.opts.folders.serve);
      return log.info("Waiting for connection... ");
    };

    ThreeflowServer.prototype.onConnection = function(socket) {
      log.info("Connection with :" + socket.id);
      socket.emit('connected', {
        event: 'connected',
        data: {}
      });
      socket.on('render', this.onRender);
      return socket.on('disconnect', function() {
        return console.log("DISCONNECTED ", socket.id);
      });
    };

    ThreeflowServer.prototype.onDisconnect = function(socket) {};

    ThreeflowServer.prototype.onRender = function(data) {
      console.log("RENDER");
      return console.log(data);
    };

    return ThreeflowServer;

  })()
};
