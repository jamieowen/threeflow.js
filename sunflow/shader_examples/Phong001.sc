trace-depths {
   diff 0
   refl 1
   refr 0
}

shader {
   name "ground"
   type diffuse
   diff 0.800000011921 0.800000011921 0.800000011921
}

shader {
   name "shader01"
   type phong
   diff { "sRGB nonlinear" 0.1 0.1 0.7 }
   spec { "sRGB nonlinear" 0.28 1 1 } 1
   samples 4
}

shader {
   name "shader02"
   type phong
   diff { "sRGB nonlinear" 0.1 0.1 0.7 }
   spec { "sRGB nonlinear" 0.28 1 1 } 4
   samples 4
}

shader {
   name "shader03"
   type phong
   diff { "sRGB nonlinear" 0.1 0.1 0.7 }
   spec { "sRGB nonlinear" 0.28 1 1 } 8
   samples 4
}

shader {
   name "shader04"
   type phong
   diff { "sRGB nonlinear" 0.1 0.1 0.7 }
   spec { "sRGB nonlinear" 0.28 1 1 } 10
   samples 4
}

shader {
   name "shader05"
   type phong
   diff { "sRGB nonlinear" 0.1 0.1 0.7 }
   spec { "sRGB nonlinear" 0.28 1 1 } 20
   samples 4
}

shader {
   name "shader06"
   type phong
   diff { "sRGB nonlinear" 0.1 0.1 0.7 }
   spec { "sRGB nonlinear" 0.28 1 1 } 30
   samples 4
}

shader {
   name "shader07"
   type phong
   diff { "sRGB nonlinear" 0.1 0.1 0.7 }
   spec { "sRGB nonlinear" 0.28 1 1 } 100
   samples 4
}

shader {
   name "shader08"
   type phong
   diff { "sRGB nonlinear" 0.1 0.1 0.7 }
   spec { "sRGB nonlinear" 0.28 1 1 } 300
   samples 4
}

shader {
   name "shader09"
   type phong
   diff { "sRGB nonlinear" 0.1 0.1 0.7 }
   spec { "sRGB nonlinear" 0.28 1 1 } 600
   samples 4
}

include "include/example_array.geo.sc"
