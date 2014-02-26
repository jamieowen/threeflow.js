clc = require 'cli-color'

module.exports =

  error_color:  clc.red.bold
  warn_color:   clc.red
  notice_color: clc.green
  info_color:   clc.cyan

  __log: (args,color)->
    console.log color.apply(@,args)

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