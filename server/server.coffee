express = require 'express'
path    = require 'path'

server  = express()

server.get '/',(request, response)->
  response.send 'hello world'

server.post '/render',(request,response)->
  response.send "render"

server.use '/examples', express.static( path.join( process.cwd(),'examples') )

server.listen 3000