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
   type ward
   diff { "sRGB nonlinear" .33 1 .33 }
   spec { "sRGB nonlinear" 1 1 1 }
   rough .4 .01
}

shader {
   name "shader02"
   type ward
   diff { "sRGB nonlinear" .33 1 .33 }
   spec { "sRGB nonlinear" 1 1 1 }
   rough .35 .01
}

shader {
   name "shader03"
   type ward
   diff { "sRGB nonlinear" .33 1 .33 }
   spec { "sRGB nonlinear" 1 1 1 }
   rough .3 .01
   samples 4
}

shader {
   name "shader04"
   type ward
   diff { "sRGB nonlinear" .33 1 .33 }
   spec 1 1 1
   rough .25 .01
   samples 4
}

shader {
   name "shader05"
   type ward
   diff { "sRGB nonlinear" .33 1 .33 }
   spec 1 1 1
   rough .2 .01
   samples 4
}

shader {
   name "shader06"
   type ward
   diff { "sRGB nonlinear" .33 1 .33 }
   spec 1 1 1
   rough .15 .01
   samples 4
}

shader {
   name "shader07"
   type ward
   diff { "sRGB nonlinear" .33 1 .33 }
   spec 1 1 1
   rough .1 .01
   samples 4
}

shader {
   name "shader08"
   type ward
   diff { "sRGB nonlinear" .33 1 .33 }
   spec { "sRGB nonlinear" 1 1 1 }
   rough .05 .01
   samples 4
}

shader {
   name "shader09"
   type ward
   diff { "sRGB nonlinear" .33 1 .33 }
   spec 1 1 1
   rough .01 .01
   samples 4
}

include "include/example_array.geo.sc"
