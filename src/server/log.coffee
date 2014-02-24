clc = require 'cli-color'

module.exports =

  # make logs look like they are actually waiting on something :)
  LOG_DELAY: 200

  error_color:  clc.red.bold
  warn_color:   clc.red
  notice_color: clc.green
  info_color:   clc.cyan

  __log: (args,color)->
    doIt = ()->
      console.log color.apply(@,args)

    setTimeout doIt,@LOG_DELAY

  error: ()->
    @__log arguments,@error_color

  warn: ()->
    @__log arguments,@warn_color

  notice: ()->
    @__log arguments,@notice_color

  info: ()->
    @__log arguments,@info_color

  clear:()->
    console.log clc.reset