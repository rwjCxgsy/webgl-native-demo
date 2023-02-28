precision mediump float;

uniform vec3 u_color;

// 法线

varying vec3 v_normal;


varying vec2 v_texcoord;


void main() {
   
   gl_FragColor = vec4(u_color, 1.0);
}