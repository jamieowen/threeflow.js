path    = require 'path'


args =
  start: true

for arg in process.argv
  args[arg] = arg

if args.init
  console.log "init--"

else if args.update
  console.log "update--"

else if args.start
  threeflow = require( path.join(__dirname,"../lib/server") ).create()
  threeflow.optionsJSON( process.cwd() )

  # force save used for rendering whilst developing - no need for anyone else to use.
  threeflow.forceSave( args["--force-save"] )
  threeflow.startup()
