shader {
  name "boxes"
  type amb-occ2
  bright   0 0 1
  dark     0 0.6 0
  samples  32
  dist     2
}

shader {
  name "ground"
  type amb-occ2
  bright   1 0 1
  dark     0 0 0
  samples  32
  dist     2
}

shader {
  name "left_sphere"
  type amb-occ2
  bright   0 1 1
  dark     0 0 0
  samples  32
  dist     2
}

shader {
  name "top_sphere"
  type amb-occ2
  bright   0 0 0
  dark     1 1 1
  samples  32
  dist     2
}

shader {
  name "right_sphere"
  type amb-occ2
  bright   0 0.3 0
  dark     0.4 0 0
  samples  32
  dist     2
}

include "include/example_scene.geo.sc"
