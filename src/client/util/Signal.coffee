
# Quick and dirty signal...

THREEFLOW.Signal = class Signal
  constructor:()->
    @listeners = null

  add:(listener)->
    if typeof listener isnt "function"
      false

    if not @listeners
      @listeners = []

    if @listeners.indexOf(listener) isnt -1
      false
    else
      @listeners.push listener
      true

  remove:(listener)->
    if not @listeners
      false

    idx = @listeners.indexOf listener

    if idx is -1
      false
    else
      @listeners.splice idx,1
      true

  removeAll:()->
    @listeners.splice(0)
    null

  dispatch:( event )->
    if not @listeners
      return null

    for listener in @listeners
      listener( event )

    null