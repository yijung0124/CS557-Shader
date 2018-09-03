#version 330 compatibility
out vec2 vST;
out vec3 vMC;
out vec3 vNf;
out vec3 vLf;
out vec3 vEf;

uniform float uA;
uniform float uB;
uniform float uC;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

vec3 eyeLightPosition = vec3(uLightX, uLightY, uLightZ);

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	vec4 p = vec4(gl_Vertex.x, gl_Vertex.y, gl_Vertex.z, 1.);
	
	vMC = p.xyz;

	vec3 Tx = vec3(1., 0., (0-uA)*uB*sin(uB*p.x)*cos(uC*p.y));
	vec3 Ty = vec3(0., 1., (0-uA)*uC*cos(uB*p.x)*sin(uC*p.y));
	vec3 normal = normalize(cross(Tx, Ty));
	
	vec4 ECposition = gl_ModelViewMatrix * p;

	vNf = normalize(gl_NormalMatrix * normal);
	vLf = eyeLightPosition - ECposition.xyz;
	vEf = vec3(0., 0., 0.) - ECposition.xyz;

	gl_Position = gl_ModelViewProjectionMatrix * p;
	//uA*cos(uB*gl_Vertex.x)*cos(uC*gl_Vertex.y)+
}