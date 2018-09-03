#version 330 compatibility
in vec2 vST;
float ResS, ResT;

uniform float uScenter;
uniform float uTcenter;
uniform float uDs;
uniform float uDt;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;
uniform bool uCircle;
uniform float uRadius;
uniform sampler2D uImageUnit;

void
main ()
{
	vec2 sct = vec2(uScenter, uTcenter);
	vec3 rgb = texture2D(uImageUnit, vST).rgb;	//color
	float s = vST.s;
	float t = vST.t;

	ivec2 ires = textureSize(uImageUnit, 0);	
	ResS = float(ires.s);
	ResT = float(ires.t);

	if(uCircle){
		if((s-uScenter)*(s-uScenter) + (t-uTcenter)*(t-uTcenter) <  uRadius)
		{
			//magnification
			s=(s-uScenter)/uMagFactor;
			t=(t-uTcenter)/uMagFactor;

			//rotate
			vec2 r = vec2(s*cos(uRotAngle)-t*sin(uRotAngle)+uScenter, s*sin(uRotAngle)+t*cos(uRotAngle)+uTcenter);
			vec3 n = texture2D(uImageUnit, r).rgb;

			//sharpening
			vec2 stp0 = vec2(1./ResS, 0. );
			vec2 st0p = vec2(0. , 1./ResT);
			vec2 stpp = vec2(1./ResS, 1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 = texture2D( uImageUnit, r ).rgb;
			vec3 im1m1 = texture2D( uImageUnit, r-stpp ).rgb;
			vec3 ip1p1 = texture2D( uImageUnit, r+stpp ).rgb;
			vec3 im1p1 = texture2D( uImageUnit, r-stpm ).rgb;
			vec3 ip1m1 = texture2D( uImageUnit, r+stpm ).rgb;
			vec3 im10 = texture2D( uImageUnit, r-stp0 ).rgb;
			vec3 ip10 = texture2D( uImageUnit, r+stp0 ).rgb;
			vec3 i0m1 = texture2D( uImageUnit, r-st0p ).rgb;
			vec3 i0p1 = texture2D( uImageUnit, r+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target += 2.*(im10+ip10+i0m1+i0p1);
			target += 4.*(i00);
			target /= 16.;
			gl_FragColor = vec4(mix( target, n, uSharpFactor), 1.);
	}else{
			gl_FragColor = vec4(rgb, 1.);
	}}
	else{
		if((s>(uScenter-uDs)) && (s<(uScenter+uDs)) && (t>(uTcenter-uDt)) && (t<(uTcenter+uDt))) {
			//magnification
			s=(s-uScenter)/uMagFactor;
			t=(t-uTcenter)/uMagFactor;

			//rotate
			vec2 r = vec2(s*cos(uRotAngle)-t*sin(uRotAngle)+uScenter, s*sin(uRotAngle)+t*cos(uRotAngle)+uTcenter);
			vec3 n = texture2D(uImageUnit, r).rgb;

			//sharpening
			vec2 stp0 = vec2(1./ResS, 0. );
			vec2 st0p = vec2(0. , 1./ResT);
			vec2 stpp = vec2(1./ResS, 1./ResT);
			vec2 stpm = vec2(1./ResS, -1./ResT);
			vec3 i00 = texture2D( uImageUnit, r ).rgb;
			vec3 im1m1 = texture2D( uImageUnit, r-stpp ).rgb;
			vec3 ip1p1 = texture2D( uImageUnit, r+stpp ).rgb;
			vec3 im1p1 = texture2D( uImageUnit, r-stpm ).rgb;
			vec3 ip1m1 = texture2D( uImageUnit, r+stpm ).rgb;
			vec3 im10 = texture2D( uImageUnit, r-stp0 ).rgb;
			vec3 ip10 = texture2D( uImageUnit, r+stp0 ).rgb;
			vec3 i0m1 = texture2D( uImageUnit, r-st0p ).rgb;
			vec3 i0p1 = texture2D( uImageUnit, r+st0p ).rgb;
			vec3 target = vec3(0.,0.,0.);
			target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
			target += 2.*(im10+ip10+i0m1+i0p1);
			target += 4.*(i00);
			target /= 16.;
			gl_FragColor = vec4(mix( target, n, uSharpFactor), 1.);
	}else{
			gl_FragColor = vec4(rgb, 1.);
	}}

}