import org.sunflow.SunflowAPI;
import org.sunflow.core.*;
import org.sunflow.core.camera.*;
import org.sunflow.core.primitive.*;
import org.sunflow.core.shader.*;
import org.sunflow.image.Color;
import org.sunflow.math.*;

// Change settings here
int depth = 5;
boolean preview = false;

public void build() {
    parameter("eye", new Point3(2.0f, 2.0f, -5.0f));
    parameter("target", new Point3(0, 0, 0));
    parameter("up", new Vector3(0.0f, 1.0f, 0.0f));
    parameter("fov", 45.0f);
    parameter("aspect", 2.0f);
    camera("camera_outside", new PinholeLens());

    parameter("eye", new Point3(0, 0.2f, 0));
    parameter("target", new Point3(-1.0f, -0.5f, 0.5f));
    parameter("up", new Vector3(0.0f, 1.0f, 0.0f));
    camera("camera_inside", new SphericalLens());
    
    parameter("maxdist", 0.4f);
    parameter("samples", 16);
    shader("ao_sponge", new AmbientOcclusionShader());
    
    parameter("maxdist", 0.4f);
    parameter("samples", 128);
    shader("ao_ground", new AmbientOcclusionShader());

    geometry("sponge", new MengerSponge(depth));
    // Matrix4 m = null;
    // m = Matrix4.rotateX((float) Math.PI / 3);
    // m = m.multiply(Matrix4.rotateZ((float) Math.PI / 3));
    // parameter("transform", m);
    parameter("shaders", "ao_sponge");
    instance("sponge.instance", "sponge");
    
    parameter("center", new Point3(0, -1.25f, 0.0f));
    parameter("normal", new Vector3(0.0f, 1.0f, 0.0f));
    geometry("ground", new Plane());
    parameter("shaders", "ao_ground");
    instance("ground.instance", "ground");

    // rendering options
    parameter("camera", "camera_inside");
    // parameter("camera", "camera_outside");
    parameter("resolutionX", 1024);
    parameter("resolutionY", 512);
	if (preview) {
		parameter("aa.min", 0);
		parameter("aa.max", 1);
		parameter("bucket.order", "spiral");
	} else {
		parameter("aa.min", 1);
		parameter("aa.max", 2);
        parameter("bucket.order", "column");
		parameter("filter", "mitchell");
	}
    options(DEFAULT_OPTIONS);
}

private static class MengerSponge extends CubeGrid {
    private int depth;

    MengerSponge(int depth) {
        this.depth = depth;
    }
    
    public boolean update(ParameterList pl, SunflowAPI api) {
        int n = 1;
        for (int i = 0; i < depth; i++)
            n *= 3;
        pl.addInteger("resolutionX", n);
        pl.addInteger("resolutionY", n);
        pl.addInteger("resolutionZ", n);
        return super.update(pl, api);
    }

    protected boolean inside(int x, int y, int z) {
        for (int i = 0; i < depth; i++) {
            if ((x % 3) == 1 ? (y % 3) == 1 || (z % 3) == 1 : (y % 3) == 1 && (z % 3) == 1) return false;
            x /= 3;
            y /= 3;
            z /= 3;
        }
        return true;
    }
}