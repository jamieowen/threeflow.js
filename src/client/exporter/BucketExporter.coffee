
class BucketExporter extends BlockExporter

  @ORDER_TYPES = [
    'hilbert'
    'spiral'
    'column'
    'row'
    'diagonal'
    'random' ]

  constructor:(exporter)->
    super(exporter)

    @orderTypes = BucketExporter.ORDER_TYPES
    @enabled    = true
    @reverse    = false
    @size       = 16
    @order      = @orderTypes[0]

  clean:()->
    null

  addToIndex:(object3d)->
    null

  doTraverse:(object3d)->
    true

  exportBlock:()->
    result = ''

    if not @enabled
      return result

    bucket = @size + ' '
    if @reverse
      bucket += '"reverse ' + @order + '"'
    else
      bucket += @order

    result += 'bucket ' + bucket + '\n'

    return result

