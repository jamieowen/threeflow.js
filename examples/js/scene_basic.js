
var SceneBasic = function( materials )
{

  var defaultMaterials = [
    // https://kuler.adobe.com/Sunrise-Picnic-color-theme-3339949/
    { materialClass: THREE.SF.ConstantMaterial, parameters:{color:0x52ADCC,wireframe:true} },
    { materialClass: THREE.SF.DiffuseMaterial, parameters:{color:0xADD982,wireframe:true} },
    { materialClass: THREE.SF.PhongMaterial, parameters:{color:0xE6F2C2,wireframe:true} },
    { materialClass: THREE.SF.PhongMaterial, parameters:{color:0xF1E56C,wireframe:true} },
    { materialClass: THREE.SF.ShinyMaterial, parameters:{color:0xF37A61,wireframe:true} },
    { materialClass: THREE.SF.ShinyMaterial, parameters:{color:0x52ADCC,wireframe:true} },
    { materialClass: THREE.SF.GlassMaterial, parameters:{color:0xADD982,wireframe:true} },
    { materialClass: THREE.SF.GlassMaterial, parameters:{color:0xE6F2C2,wireframe:true} },
    { materialClass: THREE.SF.MirrorMaterial, parameters:{color:0xF1E56C,wireframe:true} },
    { materialClass: THREE.SF.MirrorMaterial, parameters:{color:0xF37A61,wireframe:true} },
  ];

  materials = materials || defaultMaterials;

  var mesh,material,geometry,scene,offset,r,l,s;
  r = 20; s = 10; l = materials.length;

  geometry = new THREE.SphereGeometry(r);

  offset = ((l*(r*2)) + (s*(l-1)))/2;

  scene = new THREE.Scene();

  for( var i = 0; i<l; i++ )
  {
    material = new materials[i].materialClass( materials[i].parameters );
    mesh = new THREE.Mesh(geometry,material);
    mesh.position.x = Math.cos(((Math.PI*2)/l)*i)*100;
    mesh.position.z = Math.sin(((Math.PI*2)/l)*i)*100;

    scene.add( mesh );
  }

  return scene;
}
