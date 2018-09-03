#version 330 compatibility

uniform float uTime;
uniform float uAmp0, uAmp1;
uniform float uPhaseShift;
uniform float uPd;
uniform float uLightX, uLightY, uLightZ;
uniform vec4  uColor;

in vec3  vMCposition;
in vec3  vECposition;

const float TWOPI = 2.*3.14159265;
const vec3 C0 = vec3( -2.5, 0., 0. );
const vec3 C1 = vec3(  2.5, 0., 0. );

void
main( )
{
	float rad0 = length( vMCposition - C0 );
	float H0   = -uAmp0 * cos( TWOPI*rad0/uPd - TWOPI*uTime ); 

	float rad1 = length( vMCposition - C1 );
	float H1   = -uAmp1 * cos( TWOPI*rad1/uPd - TWOPI*uTime ); 

	float u = -uAmp0 * (TWOPI/uPd) * sin( TWOPI*rad0/uPd - TWOPI*uTime ); 
	float v = 0.;
	float w = 1.;

	float ang = atan( vMCposition.y - C0.y, vMCposition.x - C0.x );
	float up = dot( vec2(u,v), vec2(cos(ang), -sin(ang)) );
	float vp = dot( vec2(u,v), vec2(sin(ang),  cos(ang)) );
	float wp = 1.;

	u = -uAmp1 * (TWOPI/uPd) * sin( TWOPI*rad1/uPd - TWOPI*uTime - uPhaseShift ); 
	v = 0.;
	ang = atan( vMCposition.y - C1.y, vMCposition.x - C1.x );
	up += dot( vec2(u,v), vec2(cos(ang), -sin(ang)) );
	vp += dot( vec2(u,v), vec2(sin(ang),  cos(ang)) );
	wp += 1.;
	vec3 normal = normalize( vec3( up, vp, wp ) );

    	float LightIntensity  = abs( dot( normalize(vec3(uLightX,uLightY,uLightZ) - vECposition), normal ) );
	if( LightIntensity < 0.1 )
		LightIntensity = 0.1;

	gl_FragColor = vec4( LightIntensity*uColor.rgb, uColor.a );
}
