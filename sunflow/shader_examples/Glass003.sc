%photons {
%  caustics 10000000 kd 64 0.5
%}

shader {
  name "ground"
  type diffuse
  diff 0.800000011921 0.800000011921 0.800000011921
}

shader {
  name "shader01"
  type glass
  eta 1.55
  color 1 1 1
  absorbtion.distance 2
  absorbtion.color 0.8 0.2 0.2
}

shader {
   name "shader02"
  type glass
  eta 1.55
  color 1 1 1
  absorbtion.distance 1
  absorbtion.color 0.8 0.2 0.2
}

shader {
   name "shader03"
  type glass
  eta 1.55
  color 1 1 1
  absorbtion.distance 0.5
  absorbtion.color 0.8 0.2 0.2
}

shader {
   name "shader04"
  type glass
  eta 1.55
  color 1 1 1
  absorbtion.distance 2
  absorbtion.color 0.1 0.7 0.1
}

shader {
   name "shader05"
  type glass
  eta 1.55
  color 1 1 1
  absorbtion.distance 1
  absorbtion.color 0.1 0.7 0.1
}

shader {
   name "shader06"
  type glass
  eta 1.55
  color 1 1 1
  absorbtion.distance 0.5
  absorbtion.color 0.1 0.7 0.1
}

shader {
   name "shader07"
  type glass
  eta 1.55
  color 1 1 1
  absorbtion.distance 2
  absorbtion.color 0.3 0.3 0.6
}

shader {
   name "shader08"
  type glass
  eta 1.55
  color 1 1 1
  absorbtion.distance 1
  absorbtion.color 0.3 0.3 0.6
}

shader {
   name "shader09"
  type glass
  eta 1.55
  color 1 1 1
  absorbtion.distance 0.5
  absorbtion.color 0.3 0.3 0.6
}

include "include/example_array.geo.sc"
