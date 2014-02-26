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

    # reg ex to match stdout from sunflow
    @MATCH_PROGRESS: /\[\d{1,2}%\]/
    @MATCH_PROGRESS_INT: /\d{1,2}/
    @MATCH_RENDER_TIME: /Render time: \d*:\d{1,2}:\d{1,2}\.\d*/
    @MATCH_DONE: /Done\./

    constructor:(@client,source,@options={},@sunflowCl={})->

      @id = @client.generateRenderID()

      # if we add queuing.. ( for some reason )
      @status = "queued"

      # double check this as we defintely want to delete in no save mode.
      @options.deleteSc = if @options.deleteSc is true then true else false

      # determine pre render / post render flags.
      flags = @client.server.opts.flags
      folders = renderPath = @client.server.opts.folders

      if not @options.name or not flags.allowSave
        @filename = "." + @id
      else if @options.overwrite
        @filename = @options.name
      else
        # calculate index num for file.
        num = @getSuffixInt( @options.name,folders.renders )
        @filename = @options.name + "-" + num

      # write sunflow scene file.
      @writeSource source,folders.renders

      # some props to be populated during render
      @progress = null
      @renderTime = null


    getSuffixInt:(name,renderPath)->
      # read the contents of the render path
      # to determine the usable integer
      files = fs.readdirSync renderPath
      #regExp = new RegExp( name + "-[0-9]*\.((sc)|(png))", "g" )
      matchName = new RegExp( "^" + name + "-[0-9]*\.((sc)|(png))", "g" )
      matchNum = new RegExp("[0-9]+","g")

      maxInt = 0
      for filename in files
        matchName.lastIndex = 0
        if matchName.test(filename)
          matchNum.lastIndex = 0
          num = matchNum.exec filename
          num = parseInt( num[num.length-1][0],10 )
          maxInt = num if num > maxInt

      maxInt+1

    writeSource:(source,renderPath)->
      writePath = path.join( renderPath,@filename + ".sc" )
      log.info "Writing scene file : " + writePath
      fs.writeFileSync writePath,source
      null

    dispose:()->
      # handle
      log.error "Need to handle dispose..."
      null

    # clean up after render
    cleanUp:()->
      flags = @client.server.opts.flags
      renders = @client.server.opts.folders.renders

      log.info "Cleaning up..."
      if not flags.allowSave or (flags.deleteSc and @options.deleteSc) or (not flags.deleteSc and @options.deleteSc)
        fs.unlinkSync path.join(renders,@filename + ".sc")

      null


    isComplete:()->
      @status is "complete"

    render:()->
      log.info "Starting Sunflow..."

      @status = "started"

      sunflow = @client.server.opts.sunflow
      flags   = @client.server.opts.flags
      renders = @client.server.opts.folders.renders

      command = sunflow.command
      args    = [sunflow.memory].concat( sunflow.args )

      args.push "-jar",sunflow.jar

      args.push "-no-gui" if @sunflowCl.noGui
      args.push "-ipr" if @sunflowCl.ipr
      args.push "-hipri" if @sunflowCl.hiPri

      if flags.allowSave
        args.push "-o",path.join(renders,@filename + ".png")

      args.push path.join(renders,@filename + ".sc")

      sfProcess = child_process.spawn command,args
      sfProcess.on "close",@onProcessClose
      sfProcess.stderr.on "data",@onProcessData

      @client.socket.emit 'render-start',
        event:'render-start'
        command: [command].concat(args).join(" ")

      null

    onProcessClose:(code)=>
      if not code # exit status is not 0
        if @isComplete()

        else
          @status = "cancelled"
          log.notice "" # otherwise trails on the end of sunflow output
          log.notice "Render Cancelled."
          @cleanUp()

          if @client.connected
            @client.socket.emit 'render-cancelled',
              event:'render-cancelled'
              data:null

      else
        log.notice "" # otherwise trails on the end of sunflow output
        log.notice "Render Error. Keep this "
        @status = "error"

        @cleanUp()

        # TODO : Log Error by keeping sc file.

        if @client.connected
          @client.socket.emit 'render-error',
            event:'render-error'
            data:code

      null

    onProcessData:(buffer)=>
      # write to standard out
      process.stdout.write buffer

      progressMatched = Render.MATCH_PROGRESS.exec buffer

      if progressMatched
        intMatch = Render.MATCH_PROGRESS_INT.exec progressMatched[0]
        @progress = parseInt(intMatch[0])

        if @client.connected
          @client.socket.emit 'render-progress',
            event:'render-progress'
            progress: @progress

      else if not @isComplete()
        # check render time.
        if not @renderTime
          time = Render.MATCH_RENDER_TIME.exec buffer
          if time
            @renderTime = time[0]

        doneMatched = Render.MATCH_DONE.exec buffer
        if doneMatched
          @status = "complete"

          log.notice "" # otherwise trails on the end of sunflow output
          log.notice "Render Complete."
          @cleanUp()

          if @client.connected
            @client.socket.emit 'render-complete',
              event:'render-complete'
              time:@renderTime
