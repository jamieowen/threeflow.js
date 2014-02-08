express = require 'express'
io      = require 'socket.io'
http    = require 'http'
path    = require 'path'
childp  = require 'child_process'
fs      = require 'fs'

app     = express()
server  = http.createServer app
io      = io.listen server

server.listen 3000

# http

app.post '/render',(request,response)->
  response.send "render"

app.use '/', express.static( path.join( process.cwd(),'examples') )

# sockets
io.sockets.on 'connection', (socket)->
  socket.emit 'connected',
    event:'connected'
    data: {}

  socket.on 'render', (data)->

    if data.scContents

      pngPath = data.pngPath || null
      scPath = data.scPath || ".tmp.render.sc"

      fs.writeFileSync scPath,data.scContents

      command = 'java -Xmx1G -server -jar sunflow/sunflow.jar'

      socket.emit 'renderstart',
        event:'renderstart'
        data: 'ok'

      if pngPath
        command += " -o " + pngPath

      command += " " + scPath

      childp.exec command,(error,stdout,stderror)->
        console.log "RENDER COMPLETE"

        if not error
          socket.emit 'renderprogress',
            event:'renderprogress'
            data:null

          socket.emit 'rendercomplete',
            event:'rendercomplete'
            data:null
        else
          console.log error
    null

  null


