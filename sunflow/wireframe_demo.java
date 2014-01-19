import org.sunflow.core.ShadingState;
import org.sunflow.core.shader.WireframeShader;
import org.sunflow.image.Color;

public void build() {
    parameter("width", (float) (Math.PI * 0.5 / 8192));
    shader("ao_wire", new WireframeShader() {
        public boolean ambocc = true; // set to false to overlay wires on regular shaders
        
        public Color getFillColor(ShadingState state) {
            return ambocc ? state.occlusion(16, 6.0f) : state.getShader().getRadiance(state);
        }
    });
    // you can put the path to your own scene here to use this rendering technique
    // just copy this file to the same directory as your main .sc file, and swap
    // the fileanme in the line below
    parse("gumbo_and_teapot.sc");
    shaderOverride("ao_wire", true);

    // this may need to be tweaked if you want really fine lines
    // this is higher than most scenes need so if you render with ambocc = false, make sure you turn down
    // the sampling rates of dof/lights/gi/reflections accordingly
    parameter("aa.min", 2);
    parameter("aa.max", 2);
    parameter("filter", "blackman-harris");
    options(DEFAULT_OPTIONS);
}