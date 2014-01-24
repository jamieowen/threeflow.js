
class BlockExporter
  constructor:()->
    #---

  # override
  # Returns an optional settings object to customize the exporter.
  settings:()->
    throw new Error 'BlockExporter subclasses must override this method.'

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








