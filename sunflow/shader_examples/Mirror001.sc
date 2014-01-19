shader {
   name "ground"
   type diffuse
   diff 0.800000011921 0.800000011921 0.800000011921
}

shader {
  name "shader01"
  type mirror
  refl 0.1 0.1 0.1
}

shader {
  name "shader02"
  type mirror
  refl 0.5 0.5 0.5
}
shader {
  name "shader03"
  type mirror
  refl 1 1 1
}

shader {
  name "shader04"
  type mirror
  refl 0 0 0.1
}

shader {
  name "shader05"
  type mirror
  refl 0 0 0.5
}

shader {
  name "shader06"
  type mirror
  refl 0 0 1
}

shader {
  name "shader07"
  type mirror
  refl 0.1 0.0 0.0
}

shader {
  name "shader08"
  type mirror
  refl 0.5 0 0
}

shader {
  name "shader09"
  type mirror
  refl 1 0 0
}

include "include/example_array.geo.sc"
