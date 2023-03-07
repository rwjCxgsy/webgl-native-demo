precision mediump float;

uniform vec3 u_color;

uniform float u_bias;

// 灯光颜色
uniform vec3 u_diffuseColor;
// 环境光颜色
uniform vec3 u_ambientColor;

varying vec3 v_normal;

varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

varying vec2 v_texcoord;

#include <shadow-fv>
#include <texture-fv>

void main() {

  vec3 color = u_color;
  float shadowLight = 1.0;
  vec3 normal = v_normal;

  #include <texture-fc>
  #include <shadow-fc>
  #include <color-fc>

  gl_FragColor = vec4(color, 1.0);
}