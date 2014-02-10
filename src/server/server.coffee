express         = require 'express'
io              = require 'socket.io'
http            = require 'http'
path            = require 'path'
child_process   = require 'child_process'
fs              = require 'fs'

app             = express()
server          = http.createServer app
io              = io.listen server

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

      socket.emit 'render-start',
        event:'render-start'
        data: 'ok'

      if pngPath
        command += " -o " + pngPath

      command += " " + scPath

      child = child_process.exec command,(error,stdout,stderror)->
        console.log "RENDER COMPLETE"

        if not error
          socket.emit 'render-progress',
            event:'render-progress'
            data:null

          socket.emit 'render-complete',
            event:'render-complete'
            data:null
        else
          console.log error

      progressMatch     = /\[\d{1,2}%\]/
      progressIntMatch  = /\d{1,2}/

      # Render time: 0:00:14.4
      renderTimeMatch    = /Render time: \d*:\d{1,2}:\d{1,2}\.\d*/

      # Done.
      doneMatch  = /Done\./
      isDone = false
      renderTime = null

      child.stderr.on 'data',(buffer)->
        progress = progressMatch.exec buffer

        if progress
          pInt = progressIntMatch.exec progress[0]
          pInt = parseInt(pInt[0])
          pInt = "ERROR" if isNaN(pInt)

          socket.emit 'render-progress',
            event:'render-progress'
            data: pInt
        else if not isDone
          # check render time.
          if not renderTime
            time = renderTimeMatch.exec buffer
            if time
              renderTime = time[0]

          done = doneMatch.exec buffer
          if done
            isDone = true
            socket.emit 'render-complete',
              event:'render-complete'
              data:renderTime









        process.stdout.write buffer

      #child.stdout.pipe process.stdout
      #child.stderr.pipe process.stderr


    null

  null


