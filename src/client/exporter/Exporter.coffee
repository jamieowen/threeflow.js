
class Exporter

  # Exclude mesh types from being traversed at all.
  @EXCLUDED_OBJECT3D_TYPES :[
    # Core Types
    THREE.Camera
    THREE.Light
    THREE.Bone
    THREE.LOD
    THREE.Line
    THREE.MorphAnimMesh
    THREE.ParticleSystem
    THREE.SkinnedMesh
    THREE.Sprite

    # Other ( can comment out THREE.Line until support is added )
    THREE.ArrowHelper             # THREE.Object3D
    #THREE.AxisHelper              # THREE.Line
    THREE.BoundingBoxHelper       # THREE.Mesh
    #THREE.BoxHelper               # THREE.Line
    #THREE.CameraHelper            # THREE.Line
    THREE.DirectionalLightHelper  # THREE.Object3D
    #THREE.EdgesHelper             # THREE.Line
    #THREE.FaceNormalsHelper       # THREE.Line
    #THREE.GridHelper              # THREE.Line
    THREE.HemisphereLightHelper   # THREE.Object3D
    THREE.PointLightHelper        # THREE.Mesh
    THREE.SpotLightHelper         # THREE.Object3D
    #THREE.VertexNormalsHelper     # THREE.Line
    #THREE.VertexTangentsHelper    # THREE.Line
    #THREE.WireframeHelper         # THREE.Line

    THREE.ImmediateRenderObject   # THREE.Object3D
    THREE.LensFlare               # THREE.Object3D
    THREE.MorphBlendMesh          # THREE.Mesh
  ]


  @__checkedExcluded = false
  @__checkExcluded = ()->
    if not Exporter.__checkedExcluded

      # Test for existence of these before adding ( they appear in the examples folder )
      # add this on the constructor, so any extras that appear after threeflow <script> will show up.
      CHECK_EXCLUDED_OBJECT3D_TYPES = [
        THREE.TransformControls # THREE.Object3D
        THREE.AudioObject       # THREE.Object3D
      ]

      for cls in CHECK_EXCLUDED_OBJECT3D_TYPES
        if cls isnt undefined and typeof cls is "function"
          Exporter.EXCLUDED_OBJECT3D_TYPES.push cls

      Exporter.__checkedExcluded = true

    null

  
  constructor:()->
    Exporter.__checkExcluded()

    # global exporter settings
    @exporterSettings =
      convertPrimitives: false

    @blockExporters = []

    @image              = @addBlockExporter new ImageExporter(@)
    @bucket             = @addBlockExporter new BucketExporter(@)
    @traceDepths        = @addBlockExporter new TraceDepthsExporter(@)
    @caustics           = @addBlockExporter new CausticsExporter(@)
    @gi                 = @addBlockExporter new GiExporter(@)

    @camera             = @addBlockExporter new CameraExporter(@)
    @lights             = @addBlockExporter new LightsExporter(@)
    @modifiers          = @addBlockExporter new ModifiersExporter(@)
    @materials          = @addBlockExporter new MaterialsExporter(@)
    @geometry           = @addBlockExporter new GeometryExporter(@)
    @bufferGeometry     = @addBlockExporter new BufferGeometryExporter(@)
    @meshes             = @addBlockExporter new MeshExporter(@)


    @textureLinkages    = {}


  linkTexturePath:(texture,path)->
    if not texture instanceof THREE.Texture
      throw new Error "Texture must be of type THREE.Texture."

    if path is null
      throw new Error "Texture path must not be null."

    @textureLinkages[ texture.uuid ] = path
    null

  addBlockExporter:(exporter)->
    if not exporter instanceof BlockExporter
      throw new Error 'Extend BlockExporter'
    else
      @blockExporters.push( exporter )

    exporter

  # index the three js scene
  indexScene:(object3d)->

    # check for exlucded object3d types and ignore
    for cls in Exporter.EXCLUDED_OBJECT3D_TYPES
      if object3d instanceof cls
        THREEFLOW.warn "Ignored object.", object3d
        return

    if object3d.children.length
      for child in object3d.children

        # helper to prevent traversing children further
        # to exclude elements from the render.
        doTraverse = true

        # TODO : Auto No add-to-index with certain meshes.

        for blockExporter in @blockExporters
          if not child._tf_noIndex
            blockExporter.addToIndex( child )

          doTraverse = doTraverse and blockExporter.doTraverse( child )

        if doTraverse and not child._tf_noTraverse
          @indexScene child

    null

  exportCode:()->
    result = ''

    for blockExporter in @blockExporters
      result += blockExporter.exportBlock()

    return result




