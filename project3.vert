#version 330 compatibility
out vec2 vST;
out vec3 vMC;
out vec3 vNf;
out vec3 vLf;
out vec3 vEf;

uniform float uK;
uniform float uP;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

vec3 eyeLightPosition = vec3(uLightX, uLightY, uLightZ);
const float PI = 3.1415926;


void
main( )
{
	vST = gl_MultiTexCoord0.st;
       float x = gl_Vertex.x;
       float y = gl_Vertex.y;
	vec4 p = vec4(x, y,  uK * (1.-y) * sin( 2. * PI * x / uP ),1.);
	vMC = p.xyz;
	vec3 Tx = vec3(1., 0., uK * (1.-y) * (2.* PI / uP) * cos( 2.* PI * x / uP ));
	vec3 Ty = vec3(0., 1., -uK * sin( 2. * PI * x / uP ));
	vec3 normal = normalize(cross(Tx, Ty));
	
	vec4 ECposition = gl_ModelViewMatrix * p;

	vNf = normalize(gl_NormalMatrix * normal);
	vLf = eyeLightPosition - ECposition.xyz;
	vEf = vec3(0., 0., 0.) - ECposition.xyz;

	gl_Position = gl_ModelViewProjectionMatrix * p;
    
}
