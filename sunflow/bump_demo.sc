image {
	resolution 800 450
	aa 0 1
	filter triangle
}

% |persp|perspShape
camera {
	type   pinhole
	eye    -18.19 8.97 -0.93
	target -0.690 0.97 -0.93
	up     0 1 0
	fov    30
	aspect 1.777777777777
}

light {
  type sunsky
  up 0 1 0
  east 0 0 1
  sundir -1 1 -1
  turbidity 2
  samples 32
}

modifier {
  name bumpy_01
  type normalmap
  texture textures/brick_normal.jpg
}

modifier {
  name bumpy_02
  type bump
  texture textures/dirty_bump.jpg
  scale 0.02
}

modifier {
  name bumpy_03
  type bump
  texture textures/reptileskin_bump.png
  scale 0.02
}

modifier {
  name bumpy_04
  type bump
  texture textures/shiphull_bump.png
  scale 0.015
}

modifier {
  name bumpy_05
  type bump
  texture textures/slime_bump.jpg
  scale 0.015
}


shader {
  name default
  type shiny
  diff 0.2 0.2 0.2
  refl 0.3
}

shader {
  name glassy
  type glass
  eta 1.2
  color 0.8 0.8 0.8
  absorbtion.distance 7
  absorbtion.color { "sRGB nonlinear" 0.2 0.7 0.2 }
}

shader {
  name simple_red
  type diffuse
  diff { "sRGB nonlinear" 0.70 0.15 0.15 }
}

shader {
  name simple_green
  type diffuse
  diff { "sRGB nonlinear" 0.15 0.70 0.15 }
}

shader {
  name simple_yellow
  type diffuse
  diff { "sRGB nonlinear" 0.70 0.70 0.15 }
}


shader {
  name floor
  type diffuse
%  diff 0.3 0.3 0.3
  texture textures/brick_color.jpg
}

object {
	shader floor
	modifier bumpy_01
	type plane
	p  0 0 0
	p  4 0 3
	p -3 0 4
}

object {
	shader simple_green
	modifier bumpy_03
	transform {
		rotatex -90
		scaleu 0.018
		rotatey 245
		translate 1.5 0 -1
	}
	type teapot
	name teapot_0
	subdivs 20
}

object {
	shader glassy
	modifier bumpy_05
	transform {
		rotatex 35
		scaleu 1.5
		rotatey 245
		translate 1.5 1.5 3
	}
	type sphere
	name sphere_0
}

object {
	shader default
	modifier bumpy_05
	transform {
		rotatex 35
		scaleu 1.5
		rotatey 245
		translate 1.5 1.5 -5
	}
	type sphere
	name sphere_1
}

instance {
	name teapot_1
	geometry teapot_0
	transform {
		rotatex -90
		scaleu 0.018
		rotatey 245
		translate -1.5 0 -3
	}
	shader simple_yellow
	modifier bumpy_04
}

instance {
	name teapot_3
	geometry teapot_0
	transform {
		rotatex -90
		scaleu 0.018
		rotatey 245
		translate -1.5 0 +1
	}
	shader simple_red
	modifier bumpy_02
}
