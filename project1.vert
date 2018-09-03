#version 330 compatibility

out float vLightIntensity;
out vec2  vST; 
out vec4  vColor;

vec3 LIGHTPOS   = vec3( 7., 0., 10. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm )  );

	vColor = gl_Color;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;

}
