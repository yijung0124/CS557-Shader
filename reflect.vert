#version 330 compatibility

out float vLightIntensity; 
out vec3 vReflectVector;

void
main( )
{
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );

	vec3 eyeDir = ECposition;			// vector from eye to pt
    	vec3 normal = normalize( gl_NormalMatrix * gl_Normal );

	vReflectVector = reflect( eyeDir, normal );

	vec3 LightPos = vec3( 5., 10., 10. );
    	vLightIntensity  = 1.5 * abs( dot( normalize(LightPos - ECposition), normal ) );
	if( vLightIntensity < 0.2 )
		vLightIntensity = 0.2;
		
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
