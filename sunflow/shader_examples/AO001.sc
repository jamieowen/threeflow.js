shader {
  name ground
  type amb-occ
  bright   1 0 1
  dark     0 0 0
  samples  128
  dist     6
}

shader {
  name "shader01"
  type amb-occ
  bright   1 0.5 0
  dark     .3 .1 0
  samples  1
  dist     6
}

shader {
  name "shader02"
  type amb-occ
  bright   1 0.5 0
  dark     .3 .1 0
  samples  2
  dist     6
}

shader {
  name "shader03"
  type amb-occ
  bright   1 0.5 0
  dark     .3 .1 0
  samples  4
  dist     6
}

shader {
  name "shader04"
  type amb-occ
  bright   1 0.5 0
  dark     .3 .1 0
  samples  8
  dist     10
}

shader {
  name "shader05"
  type amb-occ
  bright   1 0.5 0
  dark     .3 .1 0
  samples  16
  dist     6
}

shader {
  name "shader06"
  type amb-occ
  bright   1 0.5 0
  dark     .3 .1 0
  samples 32
  dist     6
}

shader {
  name "shader07"
  type amb-occ
  bright   1 0.5 0
  dark     .3 .1 0
  samples  64
  dist     6
}

shader {
  name "shader08"
  type amb-occ
  bright   1 0.5 0
  dark     .3 .1 0
  samples  128
  dist     6
}

shader {
  name "shader09"
  type amb-occ
  bright   1 0.5 0
  dark     .3 .1 0
  samples  256
  dist     6
}

include include/example_array.geo.sc
