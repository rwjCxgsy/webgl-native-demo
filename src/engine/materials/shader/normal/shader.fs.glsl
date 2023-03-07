precision mediump float;

varying vec3 v_normal;

uniform vec3 u_color;
void main() {

   gl_FragColor = vec4(v_normal, 1.0);
}