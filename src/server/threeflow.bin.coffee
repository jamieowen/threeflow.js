path    = require 'path'
fs      = require 'fs'
log     = require '../lib/log'
version = require '../lib/version'
wrench  = require 'wrench'
ncp     = require 'ncp'


args =
  start: true

for arg in process.argv
  args[arg] = arg

if args["--version"]
  log.notice "Threeflow " + version.number + " / " + version.commit
  log.notice()

else if args.init
  log.notice()
  log.notice "Threeflow " + version.number
  log.info "Creating project..."

  # check for existence of json already.
  if fs.existsSync "threeflow.json"
    log.warn "threeflow.json already exists!"
    log.info()
  else
    templatePath = path.join( __dirname, "..", "templates","default" )

    if fs.existsSync templatePath
      ncp.ncp templatePath,process.cwd(),(error)->
        if error
          log.warn error
        else
          log.info "Done."
          log.notice "Now type 'threeflow start'"

        log.info()
    else
      log.error "Something went pretty wrong: Couldn't find template path."

else if args.update
  console.log "update--"

else if args.start
  threeflow = require( path.join(__dirname,"../lib/server") ).create()
  threeflow.javaDetect (success)->
    if success
      # force save used for rendering whilst developing - no need for anyone else to use.
      threeflow.forceSave( args["--force-save"] )

      success = threeflow.optionsJSON( process.cwd() )
      if success
        threeflow.startup()
        log.info()

    else
      log.info "Exiting... :("












