var ThreeflowServer, express, fs, http, io, path;

express = require('express');

io = require('socket.io');

http = require('http');

path = require('path');

fs = require('fs');

module.exports = {
  create: function() {
    var instance;
    instance = new this.ThreeflowServer();
    return instance;
  },
  ThreeflowServer: ThreeflowServer = (function() {
    function ThreeflowServer() {
      console.log("new server instance");
      this.options();
    }

    /*
    saving : allow saving of pngs & .sc files.
    output : output save path of pngs and .sc files.
    multiple : allow multiple render jobs to be spawned at once.
    queue: queue jobs and spawn automatically, if multiple is true
    */


    ThreeflowServer.prototype.options = function(options) {
      if (options == null) {
        options = {};
      }
      this.saving = options.saving || false;
      this.output = options.output || null;
      this.multiple = options.output || false;
      this.queue = options.queue || false;
      this.port = options.port || 3710;
      this.deploy = options.deploy || null;
      return null;
    };

    ThreeflowServer.prototype.startup = function() {
      console.log("startup");
      this.app = express();
      this.server = http.createServer(this.app);
      this.io = io.listen(this.server);
      this.server.listen(this.port);
      return this.app.use('/', express["static"](path.join(__dirname, '../', 'examples')));
    };

    return ThreeflowServer;

  })()
};
