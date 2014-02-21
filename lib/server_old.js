var app, child_process, express, fs, http, io, path, server;

express = require('express');

io = require('socket.io');

http = require('http');

path = require('path');

child_process = require('child_process');

fs = require('fs');

app = express();

server = http.createServer(app);

io = io.listen(server);

server.listen(3000);

app.post('/render', function(request, response) {
  return response.send("render");
});

app.use('/', express["static"](path.join(process.cwd(), 'examples')));

io.sockets.on('connection', function(socket) {
  socket.emit('connected', {
    event: 'connected',
    data: {}
  });
  socket.on('render', function(data) {
    var args, child, command, doneMatch, isDone, pngPath, progressIntMatch, progressMatch, renderTime, renderTimeMatch, scPath;
    if (data.scContents) {
      pngPath = data.pngPath || null;
      scPath = data.scPath || ".tmp.render.sc";
      fs.writeFileSync(scPath, data.scContents);
      command = 'java';
      args = ["-Xmx1G", "-server", "-jar", "sunflow/sunflow.jar"];
      socket.emit('render-start', {
        event: 'render-start',
        data: 'ok'
      });
      if (pngPath) {
        args.push("-o", pngPath);
      }
      args.push(scPath);
      child = child_process.spawn(command, args);
      progressMatch = /\[\d{1,2}%\]/;
      progressIntMatch = /\d{1,2}/;
      renderTimeMatch = /Render time: \d*:\d{1,2}:\d{1,2}\.\d*/;
      doneMatch = /Done\./;
      isDone = false;
      renderTime = null;
      child.on('close', function(code) {
        console.log("RENDER COMPLETE");
        if (!code) {
          socket.emit('render-progress', {
            event: 'render-progress',
            data: null
          });
          return socket.emit('render-complete', {
            event: 'render-complete',
            data: null
          });
        } else {
          return console.log("CODE", code);
        }
      });
      child.stderr.on('data', function(buffer) {
        var done, pInt, progress, time;
        progress = progressMatch.exec(buffer);
        if (progress) {
          pInt = progressIntMatch.exec(progress[0]);
          pInt = parseInt(pInt[0]);
          if (isNaN(pInt)) {
            pInt = "ERROR";
          }
          socket.emit('render-progress', {
            event: 'render-progress',
            data: pInt
          });
        } else if (!isDone) {
          if (!renderTime) {
            time = renderTimeMatch.exec(buffer);
            if (time) {
              renderTime = time[0];
            }
          }
          done = doneMatch.exec(buffer);
          if (done) {
            isDone = true;
            socket.emit('render-complete', {
              event: 'render-complete',
              data: renderTime
            });
          }
        }
        return process.stdout.write(buffer);
      });
    }
    return null;
  });
  return null;
});
