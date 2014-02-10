
THREEFLOW.AreaLight = class AreaLight

  constructor: () ->
    @_color = 0xff000

  Object.defineProperties @prototype,
    color:
      get: ->
        console.log "Color is..."
        @_color
      set: (value) ->
        @_color = value
