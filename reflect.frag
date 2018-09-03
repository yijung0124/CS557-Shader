#version 330 compatibility

in float vLightIntensity; 
in vec3  vReflectVector;
uniform samplerCube ReflectUnit;


void
main( )
{
	vec4 newcolor = textureCube( ReflectUnit, vReflectVector );
	gl_FragColor = newcolor;
}
