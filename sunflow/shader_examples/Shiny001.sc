shader {
   name "ground"
   type diffuse
   diff 0.800000011921 0.800000011921 0.800000011921
}

shader {
   name "shader01"
   type shiny
   diff { "sRGB nonlinear" 1 .33 .33 }
   refl .1
}

shader {
   name "shader02"
   type shiny
   diff { "sRGB nonlinear" 1 .33 .33 }
   refl .2
}

shader {
   name "shader03"
   type shiny
   diff { "sRGB nonlinear" 1 .33 .33 }
   refl .5
}

shader {
   name "shader04"
   type shiny
   diff { "sRGB nonlinear" 1 .33 .33 }
   refl .7
}

shader {
   name "shader05"
   type shiny
   diff { "sRGB nonlinear" 1 .33 .33 }
   refl .9
}

shader {
   name "shader06"
   type shiny
   diff { "sRGB nonlinear" 1 .33 .33 }
   refl 1.1
}

shader {
   name "shader07"
  type shiny
  diff { "sRGB nonlinear" 1 .33 .33 }
   refl 1.3
}

shader {
   name "shader08"
   type shiny
   diff { "sRGB nonlinear" 1 .33 .33 }
   refl 1.5
}

shader {
   name "shader09"
   type shiny
   diff { "sRGB nonlinear" 1 .33 .33 }
   refl 1.6
}

include "include/example_array.geo.sc"
