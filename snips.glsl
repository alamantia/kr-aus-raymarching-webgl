

//
// OPERATIONS
//
//
//
//	//vec3 l = vec3( sin(time) * 20.0 , 20 , cos(time)*20.0);

//p = opMod(p);
p = fract(p ) - 0.5;
d2 = sdSphere(p, 0.25);
d1 = min(d1, d2);

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

vec3 opMod(vec3 p){
  return mod(p, 4.0) - 2.0;
}
//polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
  float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
  return mix( b, a, h ) - k*h*(1.0-h);
}


float ShapeBlend( vec3 p )
{
    float d1 = sdSphere(p, 1.25);
    float d2 = sdBox(p, vec3(1.0));
    return smin( d1, d2, 0.1);
}



//
//    SHAPES
//

float sdTorus(vec3 pos)
{
   vec2 r = vec2(1.25, 0.5); //radius, section radius
   vec2 q  = vec2(length(pos.xz)-r.x, pos.y);
   float d = length(q) - r.y;
   return d;
}
float sdHMap(in vec3 pos)
{
  vec2 q = pos.xz;
  float h = 0.0;
  float s = 0.4;

  for (int i = 0; i < 5; i++) {
   h += s*cosNoise(q);
   s *= 0.05;
  }
  h *= 2.0;
  return pos.y + h;
}

float sdShape1(vec3 pos)
{
  float d1 = sdSphere(pos);
  float d2 = sdSphere(pos - vec3(1.0, 0.0, 0.0));
  return opI(d1, d2);
}

float sdShape2(vec3 pos)
{
  float c = cos(2.0 * pos.y);
  float s = sin(2.0 * pos.y);
  mat2  m = mat2(c,-s,s,c);
  vec3  q = vec3(m*pos.xy,pos.z);
  return sdBox(q + vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0));
}

float sdShape3(vec3 pos) {
  float t = 9000.00;
  float d1 = sdBox(pos, vec3(1.0, 1.0, 1.0));
  float d2 = sdSphere(pos + vec3(0.5, 0.0, -2.0));
  float d3 = sdSphere(pos - vec3(0.5, 0.0, 2.0));
  float d4 = sdSphere(pos - vec3(0.0, 0.0, 3.0));
  float d5 = sdSphere(pos + vec3(0.0, 0.0, -1.0));

  float d6 = sdSphere(pos + vec3(0.0, 1.0, -2.0));
  float d7 = sdSphere(pos + vec3(0.0, -1.0, -2.0));

  t = opS(d2, d1);
  t = opS(d3, t);
  t = opS(d4, t);
  t = opS(d5, t);
  t = opS(d6, t);
  t = opS(d7, t);

  return t;
}

float sdShape4(vec3 pos) {
  float d1 = sdBox(pos, vec3(1.0, 1.0, 1.0));
  float d2 = sdSphere(pos, 1.25);
  return opS(d2, d1);
}

float sdShape5(vec3 pos) {
  float t = 9000.0;
  float d1 = sdBox(pos, vec3(1.0, 1.0, 1.0));
  float d2 = sdSphere(pos, 1.25);
  float d3 = sdTorus(pos);

  t = opI(d1, d2);
  t = opS(d3, t);
  return t;
}
