uniform vec3 diffuse;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform float zPosition;
uniform float xPosition;
uniform float yPosition;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPos;

uniform sampler2D t0;

float PI = 3.14159265;
float LARGE_DIST = 10000.00;

vec3 hsv(float h,float s,float v) { // this is just a hue/saturation/luminance to RGB conversion
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

float sinNoise(vec3 pos) {
  return 0.5 * (sin(pos.x) + sin(pos.y));
}

float cosNoise(vec3 pos) {
  return 0.5 * (cos(pos.x) + cos(pos.y));
}

mat4 rotX (in float angle) {
    float rad = radians (angle);
    float c = cos (rad);
    float s = sin (rad);

    mat4 mat = mat4 (vec4 (1.0, 0.0, 0.0, 0.0),
                     vec4 (0.0,   c,   s, 0.0),
                     vec4 (0.0,  -s,   c, 0.0),
                     vec4 (0.0, 0.0, 0.0, 1.0));
    return mat;
}

mat4 rotY (in float angle) {
    float rad = radians (angle);
    float c = cos (rad);
    float s = sin (rad);

    mat4 mat = mat4 (vec4 (  c, 0.0,  -s, 0.0),
                     vec4 (0.0, 1.0, 0.0, 0.0),
                     vec4 (  s, 0.0,   c, 0.0),
                     vec4 (0.0, 0.0, 0.0, 1.0));

    return mat;
}

mat4 rotZ (in float angle) {
    float rad = radians (angle);
    float c = cos (rad);
    float s = sin (rad);

    mat4 mat = mat4 (vec4 (  c,   s, 0.0, 0.0),
                     vec4 ( -s,   c, 0.0, 0.0),
                     vec4 (0.0, 0.0, 1.0, 0.0),
                     vec4 (0.0, 0.0, 0.0, 1.0));

    return mat;
}

mat4 trans (vec3 t) {
    mat4 mat = mat4 (vec4 (1., .0, .0, .0),
                     vec4 (.0, 1., .0, .0),
                     vec4 (.0, .0, 1., .0),
                     vec4 (t.x, t.y, t.z, 1.));
    return mat;
}

vec3 opTransf (vec3 p, mat4 m) {
    return vec4 (m * vec4 (p, 1.)).xyz;
}

float opU( float d1, float d2 )
{
  return (d1<d2) ? d1 : d2;
}

float opS( float d1, float d2 )
{
  return max(-d1,d2);
}

float opI( float d1, float d2 )
{
  return max(d1,d2);
}

float smin( float a, float b, float k )
{
  float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
  return mix( b, a, h ) - k*h*(1.0-h);
}

vec3 opMod(vec3 p){
  return mod(p, 4.0) - 2.0;
}

float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdFloor(vec3 p) {
    return p.y + 10.0;
}

float sdHexPrism( vec3 p, vec2 h ) {
    vec3 q = abs(p);
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

const mat2 m2 = mat2(0.85, -0.73, 0.63, 0.83);

float sdFloorDisplace(vec3 p) {
    float height = 0.0;
    vec2 q = p.xz * 0.5;
    float s = 0.5;

    for (int i = 0; i < 12; i++) {
            height += s * sinNoise(vec3(q.xy,0));
            s *= 0.49;
            q = m2 * q * 1.7;
    }
    //height = s * cosNoise(vec3(q.xy, 0.0));
    return (p.y + height * 3.0) + 8.0;
}

float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}
// 1.25, 0.5)
float sdTorus(vec3 pos, vec2 k) {
     vec2 r = k;
     vec2 q  = vec2(length(pos.xz)-r.x, pos.y);
   float d = length(q) - r.y;
   return d;
}

float sdCone(vec3 p, vec3 c ) {
    vec2 q = vec2( length(p.xz), p.y );
    float d1 = -q.y-c.z;
    float d2 = max( dot(q,c.xy), q.y);
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

float opBendbox( vec3 p, vec3 b)
{
    float c = cos(20.0*p.y);
    float s = sin(20.0*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xy,p.z);
    return sdBox(q, b);
}

float sdShape3(vec3 pos, vec3 b) {
  float t = 9000.00;
    float r = 0.75;
  float d1 = sdBox(pos, b);
  float d2 = sdSphere(pos + vec3(0.5, 0.0, -2.0), r);
  float d3 = sdSphere(pos - vec3(0.5, 0.0, 2.0), r);
  float d4 = sdSphere(pos - vec3(0.0, 0.0, 3.0), r);
  float d5 = sdSphere(pos + vec3(0.0, 0.0, -1.0), r);

  float d6 = sdSphere(pos + vec3(0.0, 1.0, -2.0), r);
  float d7 = sdSphere(pos + vec3(0.0, -1.0, -2.0), r);

  t = opU(d2, d1);
  t = opU(d3, t);
  t = opU(d4, t);
  t = opU(d5, t);
  t = opU(d6, t);
  t = opU(d7, t);

  return t;
}

float sdShape4(vec3 pos, vec3 b) {
  float d1 = sdBox(pos, b);
  float d2 = sdSphere(pos, b.x + 0.25);
  return opS(d2, d1);
}

float opBlinks( vec3 p, vec3 b) {
        p.xz = mod((p.xz),1.0)-vec2(0.5);
    float c = cos(p.y);
    float s = sin(p.y + time);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
        return sdShape4(q, b);
}

float opTwistBox( vec3 p, vec3 b) {
    float c = cos(p.y);
    float s = sin(p.y + time);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xz,p.y);
        return sdShape4(q, b);
}

float sdScene(vec3 p)  {

    float d1 = LARGE_DIST;
    float d2 = LARGE_DIST;
    float d3 = LARGE_DIST;
    float d4 = LARGE_DIST;
    float blend = LARGE_DIST;
    float s =   sin(time * 0.5);
    float c = cos(time * 0.5);

    //p = opMod(p);
    //d2 = sdBox(p,vec3(0.15));
    //d1 = min(d1, d2);

    d1 = sdFloorDisplace(p);

    //d2 = sdTorus(p, vec2(4.25, 0.5));
    d2 = opTwistBox(p + vec3(0.75 - s, 0.0, 0.0), vec3(0.75));
    d1 = min(d1, d2);

 // Blending
    d2 = sdSphere(p + vec3(0.75 - s, -s, c), 1.0);
    d1 = min(d1, d2);

    d3 = sdSphere(p + vec3(-0.75 + s, s, s), 1.0);
    d1 = min(d1, d3);

    blend = smin(d3, d2, .7);
    d1= min(blend, d1);

    //mat4 m1 = rotX (10.0  * time);
    //mat4 m2 = rotZ (10.0  * time);
    //mat4 m3 = rotY (10.0 * time);

    //d2 = sdBox(opTransf(p, m1 * m2), vec3(1.0));
    //d1 = min(d1, d2);


    //
    // d2 = sdBox(p - vec3(4.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
    // d1 = min(d1, d2);
    //
    // d2 = ShapeBlend(p);
    // d1 = min(d1, d2);
    //
    // d2 = sdBox(p + vec3(4.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
    // d1 = min(d1, d2);
    return d1;
}

vec3 sdNormal (vec3 p) {
    vec3 nor;
    vec2 e = vec2(0.01, 0.0);
    nor.x = sdScene(p + e.xyy) - sdScene(p - e.xyy);
    nor.y = sdScene(p + e.yxy) - sdScene(p - e.yxy);
    nor.z = sdScene(p + e.yyx) - sdScene(p - e.yyx);
    return normalize(nor);
}

vec3 getFloorTexture(vec3 p) {
    vec2 m = mod(p.xz, 12.0) - vec2(6.0);
    return m.x * m.y > 0.0 ? vec3(0.1) : vec3(0.5);
}

float doShadow(vec3 ro, vec3 rd) {
    float res = 1.0;
    float t = 0.1;
    for (int i = 0; i < 16; i++) {
        vec3 p = ro + t * rd;
        float h = sdScene(p);
        res = min(res, 10.0 * max(h, 0.0) / t);
        if (res < 0.1) break;
        t += h;
    }
    return max(res, 0.1);
}

vec3 doMaterial(vec3 p, vec3 ro, vec3 rd) {
    vec3 material = vec3(0.5);
    vec3 specular = vec3(0.75);

    if (p.y <= -3.0) {
        material = getFloorTexture(p);
        specular = vec3(0.0);
    }

    vec3 n = sdNormal(p);
    vec3 l = normalize(vec3(0.0,1.0,0.0));

    float shadow = doShadow(p + n * 0.1, l);
    vec3 diffuse = max(0.0, dot(l, n)) * vec3(1.0) * shadow;
    vec3 c = material * (diffuse + specular);

    return c;
}

void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 m = mouse.xy / resolution.xy;

    p = p * 2.0 - 1.0;
    m = m * 2.0 - 1.0;

    p.x *= resolution.x / resolution.y;
    m.x *= resolution.x / resolution.y;

    vec3 ro = vec3(xPosition, yPosition , zPosition+1.0);
    vec3 rd = vec3(p, -1.0);

    float tmax = 80.0;
    float t    = 0.0;
    vec3 pos;

    for (int i = 0; i < 256; i++) {

        vec3 pos = ro + rd * t;

        float h = sdScene(pos);

        if (h < 0.001 || t > tmax)
          break;
        t += h * 0.5;
    }

    vec3 c;

    if ( t < tmax) {
        pos = ro + rd * t;
        // we hit something, color with the proper material.
        c = doMaterial(pos, ro, rd);
    } else {
        //c = hsv(0.0,smoothstep(-1.5,2.5,p.y), 0.25);
        c = hsv(0.0, 0.0, 0.001);
    }

    gl_FragColor = vec4(c.xyz, 1.0);
}
