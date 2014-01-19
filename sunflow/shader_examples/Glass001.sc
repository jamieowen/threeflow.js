% photons {
%   caustics 10000000 kd 64 0.5
% }

shader {
  name "ground"
  type diffuse
  diff 0.800000011921 0.800000011921 0.800000011921
}

shader {
  name "shader01"
  type glass
  eta 1.1
  color 1 1 1
}

shader {
   name "shader02"
  type glass
  eta 1.3
  color 1 1 1
}

shader {
   name "shader03"
  type glass
  eta 1.5
  color 1 1 1
}

shader {
   name "shader04"
  type glass
  eta 1.7
  color 1 1 1
}

shader {
   name "shader05"
  type glass
  eta 1.9
  color 1 1 1
}

shader {
   name "shader06"
  type glass
  eta 2.1
  color 1 1 1
}

shader {
   name "shader07"
  type glass
  eta 2.3
  color 1 1 1
}

shader {
   name "shader08"
  type glass
  eta 2.5
  color 1 1 1
}

shader {
   name "shader09"
  type glass
  eta 2.7
  color 1 1 1
}

include "include/example_array.geo.sc"
