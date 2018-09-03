#version 330 compatibility

flat in vec3 vNf;
     in vec3 vNs;
flat in vec3 vLf;
     in vec3 vLs;
flat in vec3 vEf;
     in vec3 vEs;

uniform float Ka, Kd, Ks;

uniform vec4 uColor;
uniform vec4 SpecularColor;
uniform float NoiseAmp;
uniform	float NoiseFreq;
uniform sampler3D Noise3;
uniform float Shininess;

uniform bool Flat;
uniform bool uHalf;
in vec3  vMCposition;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main( )
{
	vec3 Normal;
	vec3 Light;
	vec3 Eye;
	
	vec4 nvx = NoiseAmp * texture3D( Noise3, NoiseFreq*vMCposition );
    vec4 nvy = NoiseAmp * texture3D( Noise3, NoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a;	// 1. -> 3.
	angx = angx - 2.;
	angx *= NoiseAmp;
	float angy = nvy.r + nvy.g + nvy.b + nvy.a;	// 1. -> 3.
	angy = angy - 2.;
	angy *= NoiseAmp;

	
	if(Flat)
	{
		Normal = RotateNormal(angx, angy, vNf);
		Light = normalize(vLf);
		Eye = normalize(vEf);
	}
	else
	{
		Normal = RotateNormal(angx, angy, vNs);
		Light = normalize(vLs);
		Eye = normalize(vEs);
	}

	vec4 ambient = Ka * uColor;

	float d = max( dot(Normal,Light), 0. );
	vec4 diffuse = Kd * d * uColor;

	float s = 0.;
	if( dot(Normal,Light) > 0. )		// only do specular if the light can see the point
	{
		// use the reflection-vector:
		vec3 ref = normalize( 2. * Normal * dot(Normal,Light) - Light );
		s = pow( max( dot(Eye,ref),0. ), Shininess );
	}
	vec4 specular = Ks * s * SpecularColor;

	gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );

}