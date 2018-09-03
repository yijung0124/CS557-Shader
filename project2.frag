#version 330 compatibility

in vec3 vMCposition;
in vec4 vColor;
in float vLightIntensity;
in vec2 vST;
in float Z; 

uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;
uniform float uTol;
uniform sampler3D Noise3;
uniform bool uUseChromaDepth;
uniform float uChromaRed;
uniform float uChromaBlue;
uniform vec4 uOvalColor;

vec3
ChromaDepth( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1. - 6. * ( t - (5./6.) );

 if( t <= (5./6.) )
 {
 r = 6. * ( t - (4./6.) );
 g = 0.;
 b = 1.;
 }

 if( t <= (4./6.) )
 {
 r = 0.;
 g = 1. - 6. * ( t - (3./6.) );
 b = 1.;
 }

 if( t <= (3./6.) )
 {
 r = 0.;
 g = 1.;
 b = 6. * ( t - (2./6.) );
 }

 if( t <= (2./6.) )
 {
 r = 1. - 6. * ( t - (1./6.) );
 g = 1.;
 b = 0.;
 }

 if( t <= (1./6.) )
 {
 r = 1.;
 g = 6. * t;
 }

	return vec3( r, g, b );
}

void
main( )
{ 
 vec4 nv = texture3D( Noise3, uNoiseFreq * vMCposition );
	float n = nv.r + nv.g + nv.b + nv.a;	// range is 1. -> 3.
	n = n - 2.;	//range is -1. -> 1.

	float s = vST.s;
	float t = vST.t;
	float sp = 2. * s;
	float tp = t;

	float Ar = uAd/2.;
	float Br = uBd/2.;

	
	int numins = int( sp / uAd );
	int numint = int( tp / uBd );

	gl_FragColor = vColor;	// default color
	float alpha = 1.; 

	float sc = float(numins)*uAd + Ar;
	float tc = float(numint)*uBd + Br;
	sp = sp - sc;
	tp = tp - tc;
 vec3 upvp = vec3(sp,tp,0);
	vec3 cntr = vec3( 0., 0., 0. );

 vec3 delta = upvp - cntr;	// vector from center to u',v'
 float oldrad = length(delta); // result from the ellipse equation
 float newrad = oldrad + uNoiseAmp * n;
 delta = delta * newrad / oldrad;
	float deltau = delta.x;
	float deltav = delta.y;

	deltau = deltau/Ar;
	deltav = deltav/Br;
	float d = pow(deltau ,2)+ pow(deltav ,2);
	if( abs( d - 1. ) <= uTol )
	{
	float j = smoothstep( 1.-uTol, 1.+uTol, d );
	gl_FragColor = mix( uOvalColor, vColor, j );
	}
	if( d <= 1.-uTol)
	{ 
	float k = smoothstep( 1.-uTol, 1.+uTol, d );
	gl_FragColor = mix( uOvalColor, vColor, k );
	}
	if(d > 1.+uTol)
	{
	alpha = uAlpha;
	gl_FragColor = vColor;
	if (uAlpha==0.){
	discard;
	}
	}
	
	if (uUseChromaDepth)
	{
	float t = (2./3.) * ( Z - uChromaRed ) / ( uChromaBlue - uChromaRed );
	t = clamp( t, 0., 2./3. );
	gl_FragColor.xyz = ChromaDepth( t );
	}
	gl_FragColor = vec4( vLightIntensity*gl_FragColor.xyz, alpha);
	
}