#version 330 compatibility

uniform float LightX, LightY, LightZ;
uniform float A;
uniform float B;
uniform float C;

flat out vec3 vNf;
     out vec3 vNs;
flat out vec3 vLf;
     out vec3 vLs;
flat out vec3 vEf;
     out vec3 vEs;
out vec3  vMCposition;
vec3 eyeLightPosition = vec3( LightX, LightY, LightZ );


void
main( )
{ 

	vec4 nVertex = gl_Vertex;
	float z = A * cos(B * gl_Vertex.x) * cos(C * gl_Vertex.y);
	nVertex.z = z;
	float dzdx = - A * B * sin(B * gl_Vertex.x) * cos(C * gl_Vertex.y);
	float dzdy = - A * C * cos(B * gl_Vertex.x) * sin(C * gl_Vertex.y);
	
	vec3 Tx = vec3(1., 0., dzdx);
	vec3 Ty = vec3(0., 1., dzdy);
	vec3 nNormal = normalize(cross(Tx, Ty));
	vec4 ECposition = gl_ModelViewMatrix * nVertex;
	vMCposition = nVertex.xyz;
	vNf = normalize( gl_NormalMatrix * nNormal );	// surface normal vector
	vNs = vNf;

	vLf = eyeLightPosition - ECposition.xyz;		// vector from the point
									// to the light position
	vLs = vLf;

	vEf = vec3( 0., 0., 0. ) - ECposition.xyz;		// vector from the point
									// to the eye position 
	vEs = vEf;

	gl_Position = gl_ModelViewProjectionMatrix * nVertex;
}