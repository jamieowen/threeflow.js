path            = require 'path'
child_process   = require 'child_process'
fs              = require 'fs'
log             = require './log'

module.exports =

  createRender: ( client,source,options,sunflow_cl )->
    render = new Render( client,source,options,sunflow_cl )
    render

  createQueue:(server)->
    queue = new RenderQueue(server)
    queue

  RenderQueue: class RenderQueue
    constructor:( @server )->
      @renders = []

    add:(render)->
      @renders.push render
      null

    remove:(render)->
      idx = @renders.indexOf render
      @renders.splice idx,1
      null

    removeAllByClient:(client)->
      # clean up renders.
      i = @renders.length
      while i
        render = @renders[i]
        if render.client.id is client.id
          @renders.splice(i,1)
          render.dispose()
        i--

      null

    process:()->
      if @renders.length
        render = @renders.pop()

        if render.status isnt "error"
          render.render()
        else
          @process()

      null

  Render: class Render
    constructor:(@client,source,options={},sunflow_cl={})->

      @id = @client.generateRenderID()

      if not source
        @status = "error"
        @message = "No scene source given."
      else
        # if we add queuing.. ( for some reason )
        @status = "queued"
        @message = "Queued"

        @writeSource options.name,source

    writeSource:(name,source)->
      # write scene file
      if not name
        filename = ".tmp.render.sc"
      else
        filename = name + ".sc"

      server = @client.server
      path = path.join server.opts.folders.renders,filename

      log.info "Writing scene file: " + path
      fs.writeFileSync path

    dispose:()->
      # handle

    render:()->
      console.log "start rendering....."
















