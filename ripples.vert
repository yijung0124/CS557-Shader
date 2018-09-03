#version 330 compatibility

out vec3  vMCposition;
out vec3  vECposition;

void
main( ) 
{
	vMCposition = gl_Vertex.xyz;
	vECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
