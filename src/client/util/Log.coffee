
class Log
  constructor:()->
    @enabled = true
    if not window.console
      window.console = {}

    if not window.console.log
      window.console.log = ()->
        null

  setEnabled:(value)=>
    @enabled = value
    null

  args:(args)->
    Array.prototype.slice.call(args,0)


  log:()=>
    if @enabled
      console.log.apply console,["[Threeflow]"].concat( @args(arguments) )
    null

  warn:()=>
    if @enabled
      console.log.apply console,["[Threeflow]", "!!!"].concat( @args(arguments) )

    null

THREEFLOW.__log = new Log()
THREEFLOW.log   = THREEFLOW.__log.log
THREEFLOW.warn  = THREEFLOW.__log.warn


