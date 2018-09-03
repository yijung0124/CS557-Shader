#version 330 compatibility

in float vLightIntensity; 
in vec4  vColor;
in vec2  vST;

uniform float uAd;
uniform float uBd;
uniform float uTol;

const vec4 Pink = vec4( 1., 0., 0.5, 1 );

void
main( )
{
	float s = vST.s;
	float t = vST.t;
	float Ar = uAd/2.;
     float Br = uBd/2.;
     int numins = int( s / uAd );
     int numint = int( t / uBd );
     float sc = numins *uAd + Ar;
     float tc = numint *uBd + Br;
     float sr = s - sc;
     float tr = t - tc;
     float f = (sr*sr)/(Ar*Ar)+(tr*tr)/(Br*Br);
	float m = smoothstep( 1-uTol, 1+uTol, f )  ;
     gl_FragColor = mix( Pink, vColor, m );
	gl_FragColor.rgb *= vLightIntensity;
}
