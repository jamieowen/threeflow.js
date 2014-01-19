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
  sundir 1 1 1
  turbidity 4
  samples 64
}

shader {
  name default
  type shiny
  diff 0.2 0.2 0.2
  refl 0.1
}

shader {
  name simple
  type diffuse
  diff 0.2 0.2 0.2
}

shader {
  name simple_red
  type diffuse
  diff { "sRGB nonlinear" 0.8 0.2 0.2 }
}

shader {
  name simple_green
  type diffuse
  diff { "sRGB nonlinear" 0.2 0.8 0.2 }
}

shader {
  name simple_blue
  type diffuse
  diff { "sRGB nonlinear" 0.2 0.2 0.8 }
}

shader {
  name simple_yellow
  type diffuse
  diff { "sRGB nonlinear" 0.8 0.8 0.2 }
}


shader {
  name floor
  type diffuse
  diff 0.1 0.1 0.1
}

object {
	shader default
	transform {
		rotatex -90
		scaleu 0.1
		rotatey 75
		translate -0.25 0 0.63
	}
	type gumbo
	name gumbo_0
	subdivs 7
}

object {
	shader simple_red
	transform {
		rotatex -90
		scaleu 0.1
		rotatey 25
		translate 1.5 0 -1.5
	}
	type gumbo
	name gumbo_1
	subdivs 4
	smooth false
}

object {
	shader simple_blue
	transform {
		rotatex -90
		scaleu 0.1
		rotatey 25
		translate 0 0 -3
	}
	type gumbo
	name gumbo_2
	subdivs 3
	smooth false
}

object {
	shader simple_green
	transform {
		rotatex -90
		scaleu 0.1
		rotatey -25
		translate 1.5 0 +1.5
	}
	type gumbo
	name gumbo_3
	subdivs 6
	smooth false
}

object {
	shader simple_yellow
	transform {
		rotatex -90
		scaleu 0.1
		rotatey -25
		translate 0 0 +3
	}
	type gumbo
	name gumbo_4
	subdivs 8
	smooth false
}

object {
	shader floor
	type plane
	p 0 0 0
	n 0 1 0
}

object {
	shader default
	transform {
		rotatex -90
		scaleu 0.008
		rotatey 245
		translate -3 0 -1
	}
	type teapot
	name teapot_0
	subdivs 7
}

object {
	shader simple_yellow
	transform {
		rotatex -90
		scaleu 0.008
		rotatey 245
		translate -1.5 0 -3
	}
	type teapot
	name teapot_1
	subdivs 4
	smooth false
}

object {
	shader simple_green
	transform {
		rotatex -90
		scaleu 0.008
		rotatey 245
		translate 0 0 -5
	}
	type teapot
	name teapot_2
	subdivs 3
	smooth false
}

object {
	shader simple_red
	transform {
		rotatex -90
		scaleu 0.008
		rotatey 245
		translate -1.5 0 +1
	}
	type teapot
	name teapot_3
	subdivs 5
	smooth false
}

object {
	shader simple_blue
	transform {
		rotatex -90
		scaleu 0.008
		rotatey 245
		translate 0 0 +3
	}
	type teapot
	name teapot_4
	subdivs 7
	smooth false
}

