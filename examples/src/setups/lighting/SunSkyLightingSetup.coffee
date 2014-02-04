
class SunSkyLightingSetup
  constructor:()->
    @inited = false

  init:()->
    if @inited
      return

    @inited = true
    @sunskyLight = new THREE.SF.SunskyLight()

    null

  add:(scene)->
    @init()

    scene.add @sunskyLight
    null

  remove:(scene)->

    scene.remove @sunskyLight
    null

  update:()->
    null




