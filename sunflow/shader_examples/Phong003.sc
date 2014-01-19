trace-depths {
   diff 0
   refl 1
   refr 0
}

shader {
   name "ground"
   type phong
   diff { "sRGB nonlinear" 0.3 0.3 0.3 }
   spec { "sRGB nonlinear" 0.9 0.9 0.9 } 20
   samples 4
}

shader {
   name "boxes"
   type phong
   diff { "sRGB nonlinear" 0.3 0.3 0.3 }
   spec { "sRGB nonlinear" 0.9 0.9 0.9 } 20
   samples 4
}

shader {
   name "top_sphere"
   type phong
   diff { "sRGB nonlinear" 0.3 0.3 0.3 }
   spec { "sRGB nonlinear" 0.9 0.9 0.9 } 20
   samples 4
}

shader {
   name "left_sphere"
   type phong
   diff { "sRGB nonlinear" 0.3 0.3 0.3 }
   spec { "sRGB nonlinear" 0.9 0.9 0.9 } 20
   samples 4
}

shader {
   name "right_sphere"
   type phong
   diff { "sRGB nonlinear" 0.3 0.3 0.3 }
   spec { "sRGB nonlinear" 0.9 0.9 0.9 } 20
   samples 4
}

include "include/example_scene.geo.sc"
