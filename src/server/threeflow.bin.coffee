path    = require 'path'
log     = require '../lib/log'


args =
  start: true

for arg in process.argv
  args[arg] = arg

if args.init
  console.log "init--"

else if args.update
  console.log "update--"

else
  threeflow = require( path.join(__dirname,"../lib/server") ).create()
  threeflow.javaDetect (success)->
    if success
      # force save used for rendering whilst developing - no need for anyone else to use.
      threeflow.forceSave( args["--force-save"] )

      threeflow.optionsJSON( process.cwd() )
      threeflow.startup()
    else
      log.info "Exiting... :("












