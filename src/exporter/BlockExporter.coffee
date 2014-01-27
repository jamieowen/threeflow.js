
class BlockExporter
  constructor:()->
    #---

  # override.
  # Determines if the exporter handles this object type.
  addToIndex:(object3d)->
    throw new Error 'BlockExporter subclasses must override this method.'

  # override.
  # Determines if the
  doTraverse:(object3d)->
    throw new Error 'BlockExporter subclasses must override this method.'

  # override
  # Exports the final sunflow code block for the supplied object.
  exportBlock:()->
    throw new Error 'BlockExporter subclasses must override this method.'

  # helper methods

  exportColorTHREE:(color)->
    '{ "sRGB nonlinear" ' + color.r + ' ' + color.g + ' ' + color.b + ' }'


  exportColorHex:(hex)->

    r = ( hex >> 16 & 0xff ) / 255
    g = ( hex >> 8  & 0xff ) / 255
    b = ( hex & 0xff ) / 255

    '{ "sRGB nonlinear" ' + r + ' ' + g + ' ' + b + ' }'

  exportVector:(vector)->
    vector.x + " " + vector.y + " " + vector.z

  exportFace:(face)->
    face.a + " " + face.b + " " + face.c

  exportTransform:(object3d)->
    result = ''

    for element in object3d.matrixWorld.elements
      result += ' ' + element

    result    










