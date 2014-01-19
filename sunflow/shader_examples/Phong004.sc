trace-depths {
   diff 0
   refl 1
   refr 0
}

shader {
   name "boxes"
   type phong
   diff { "sRGB nonlinear" 0.3 0.3 0.3 }
   spec { "sRGB nonlinear" 0.90000000298 0.90000000298 0.90000000298 } 20
   samples 4
}

shader {
   name "ground"
   type phong
   diff { "sRGB nonlinear" 0.3 0.3 0.3 }
   spec { "sRGB nonlinear" 1.90000000298 1.90000000298 1.90000000298 } 20
   samples 8
}

shader {
   name "left_sphere"
   type phong
   diff { "sRGB nonlinear" 0.9 0.4 0.0 }
   spec { "sRGB nonlinear" 1.00000000298 0.50000000298 0.00000000298 } 20
   samples 4
}

shader {
   name "top_sphere"
   type phong
   diff { "sRGB nonlinear" 0.7 0.1 0.0 }
   spec { "sRGB nonlinear" 0.90000000298 0.30000000298 0.00000000298 } 3
   samples 4
}

shader {
   name "right_sphere"
   type phong
   diff { "sRGB nonlinear" 0.0 0.7 1.0 }
   spec { "sRGB nonlinear" 0.30000000298 0.40000000298 0.50000000298 } 130
   samples 4
}

include "include/example_scene.geo.sc"
