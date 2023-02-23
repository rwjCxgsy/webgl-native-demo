attribute vec4 a_position;

uniform mat4 u_projection;

uniform mat4 u_camera;

uniform mat4 u_modelView;

attribute vec3 a_color;

varying vec3 v_color;

void main() {
  gl_Position = u_projection * u_camera * u_modelView * a_position;
  v_color = a_color;
}