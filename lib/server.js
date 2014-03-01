var Client, Server, child_process, express, fs, http, io, log, path, render, version, wrench,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

express = require('express');

io = require('socket.io');

http = require('http');

path = require('path');

fs = require('fs');

child_process = require('child_process');

log = require('./log');

version = require('./version');

render = require('./render');

wrench = require('wrench');

module.exports = {
  create: function() {
    var instance;
    log.clear();
    instance = new this.Server();
    return instance;
  },
  Server: Server = (function() {
    function Server() {
      this.onConnection = __bind(this.onConnection, this);
      log.notice("Threeflow " + version.number);
      this.opts = null;
      this.app = null;
      this.server = null;
      this.io = null;
      this.clients = {};
      this.renderQ = render.createQueue(this);
    }

    Server.prototype.javaDetect = function(onComplete) {
      var _this = this;
      log.info("Detecting Java");
      child_process.exec("java -version", function(error, stdout, stderr) {
        if (error) {
          log.error("Java not found. Install it!");
          return onComplete(false);
        } else {
          return onComplete(true);
        }
      });
      return true;
    };

    Server.prototype.defaults = function() {
      var opts;
      opts = {
        server: {
          port: 3710,
          debug: false,
          "static": "/examples"
        },
        sunflow: {
          version: "-version",
          command: "java",
          jar: path.join(__dirname, "../sunflow/sunflow.jar"),
          memory: "-Xmx1G",
          args: ["-server"]
        },
        flags: {
          multipleRenders: false,
          allowSave: false,
          allowQueue: false,
          deleteSc: true,
          cancelRendersOnDisconnect: false
        },
        folders: {
          renders: "/deploy/renders"
        }
      };
      return opts;
    };

    Server.prototype.options = function(options) {
      var opt;
      if (options == null) {
        options = {};
      }
      this.opts = this.defaults();
      for (opt in options.server) {
        this.opts.server[opt] = options.server[opt];
      }
      for (opt in options.flags) {
        this.opts.flags[opt] = options.flags[opt];
      }
      for (opt in options.folders) {
        this.opts.folders[opt] = options.folders[opt];
      }
      return null;
    };

    Server.prototype.optionsJSON = function(cwd) {
      var error, jsonFile, jsonOpts, jsonPath, success;
      success = false;
      try {
        log.info("Looking for config");
        jsonPath = path.join(cwd, "threeflow.json");
        jsonFile = fs.readFileSync(jsonPath);
        jsonOpts = JSON.parse(jsonFile);
        this.options(jsonOpts);
        this.opts.flags.allowSave = true;
        this.setCwd(cwd);
        log.info("Found /threeflow.json");
        success = true;
      } catch (_error) {
        error = _error;
        this.setCwd(null);
        this.options();
        if (error instanceof SyntaxError) {
          log.warn("Error parsing /threeflow.json. [ '" + error.message + "' ]");
        } else {
          log.warn("No /threeflow.json found.");
          log.info("Type 'threeflow init' to start a project.");
          log.info();
        }
        success = false;
      }
      return success;
    };

    Server.prototype.forceSave = function(value) {
      if (value) {
        this.opts.flags.allowSave = true;
      }
      return null;
    };

    Server.prototype.setCwd = function(cwd) {
      return this.cwd = cwd;
    };

    Server.prototype.startup = function() {
      var absFolder, folder, staticFolder;
      if (!this.opts) {
        this.opts = this.defaults();
      }
      if (!this.cwd) {
        log.notice("Starting up without config for now (Renders won't be saved!)");
        this.cwd = path.join(__dirname, "..");
      } else {
        log.notice("Starting up...");
      }
      for (folder in this.opts.folders) {
        absFolder = path.join(this.cwd, this.opts.folders[folder]);
        this.opts.folders[folder] = absFolder;
        if (!fs.existsSync(absFolder)) {
          wrench.mkdirSyncRecursive(absFolder);
        }
      }
      this.app = express();
      this.server = http.createServer(this.app);
      this.io = io.listen(this.server, {
        log: this.opts.server.debug
      });
      this.io.sockets.on('connection', this.onConnection);
      this.server.listen(this.opts.server.port);
      log.info("Listening on localhost:" + this.opts.server.port);
      staticFolder = path.join(this.cwd, this.opts.server["static"]);
      if (!fs.existsSync(staticFolder)) {
        wrench.mkdirSyncRecursive(staticFolder);
      }
      this.app.use('/', express["static"](staticFolder));
      log.info("Serving " + this.opts.server["static"]);
      return log.notice("Waiting for connection... ");
    };

    Server.prototype.onConnection = function(socket) {
      var client;
      client = new Client(socket, this);
      this.clients[client.id] = client;
      return log.info("Client Connected : " + client.id);
    };

    Server.prototype.disconnectClient = function(client) {
      log.info("Client Disconnected : " + client.id);
      this.clients[client.id] = null;
      delete this.clients[client.id];
      this.renderQ.removeAllByClient(client);
      return client.dispose();
    };

    return Server;

  })(),
  /*
  Client Object.
  */

  Client: Client = (function() {
    function Client(socket, server) {
      this.socket = socket;
      this.server = server;
      this.onDisconnect = __bind(this.onDisconnect, this);
      this.onRender = __bind(this.onRender, this);
      this.id = this.socket.id;
      this.socket.emit('connected', {
        id: this.socket.id
      });
      this.socket.on('render', this.onRender);
      this.socket.on('disconnect', this.onDisconnect);
      this.connected = true;
      this.renderID = 0;
    }

    Client.prototype.generateRenderID = function() {
      this.renderID++;
      return this.id + "-" + this.renderID;
    };

    Client.prototype.onRender = function(renderData) {
      var options, ren, source, sunflowCl;
      log.notice("Received Render...");
      source = renderData.source;
      options = renderData.options;
      sunflowCl = renderData.sunflowCl;
      ren = render.createRender(this, source, options, sunflowCl);
      this.server.renderQ.add(ren);
      this.socket.emit('render-added', {
        id: ren.id,
        status: ren.status,
        message: ren.message
      });
      this.server.renderQ.process();
      return null;
    };

    Client.prototype.onDisconnect = function() {
      this.connected = false;
      return this.server.disconnectClient(this);
    };

    Client.prototype.dispose = function() {
      this.socket = null;
      return null;
    };

    return Client;

  })()
};
