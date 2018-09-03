#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;		// from a slider

in vec3 Tangent;				// passed in per vertex

out vec3 vBTNx, vBTNy, vBTNz;
out vec2 vST;
out vec3 vDirToLight;				// light direction in TNB coords
out vec3 vNormal;

// N is the direction of normal
// T is the direction of "Tangent", which is (dx/dt, dy/dt, dz/dt)
// B is the TxN, which is the direction of (dx/ds, dy/ds, dz/ds)

void
main( ) 
{
	vST = gl_MultiTexCoord0.st;

	// the vectors B-T-N form an X-Y-Z-looking right handed coordinate system:

	vec3 N = normalize( gl_NormalMatrix * gl_Normal );
	vec3 T;
	vec3 B;

	// There are 2 good ways to get the tangent and binormal vectors:
	//	1. Have the Tangent already defined (glman's Sphere does this)
	//	2. Pick a general rule, eg, "Tangent approx= up"
	//		2a. Use Gram-Schmidt to correctly orthogonalize it
	//		2b. Use two cross-products to correctly orthogonalize it

#define GRAM_SCHMIDT_METHOD

#ifdef HAVE_TANGENT_METHOD
	T = normalize(  vec3( gl_ModelViewMatrix*vec4(Tangent,0.) )  );
	B = normalize( cross(T,N) );
#endif

#ifdef GRAM_SCHMIDT_METHOD
	T = vec3( 0.,1.,0.);
	float d = dot( T, N );
	T = normalize( T - d*N );
	B = normalize( cross(T,N) );
#endif

#ifdef CROSS_PRODUCT_METHOD
	T = vec3( 0.,1.,0.);
	B = normalize( cross(T,N) );
	T = normalize( cross(N,B) );
#endif

	// Produce the transformation from Surface coords to Eye coords:

	vBTNx = vec3( B.x, T.x, N.x );
	vBTNy = vec3( B.y, T.y, N.y );
	vBTNz = vec3( B.z, T.z, N.z );

	// where the light is coming from:

	vec3 LightPosition = vec3( uLightX, uLightY, uLightZ );
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vDirToLight = normalize( LightPosition - ECposition );
	
	
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}