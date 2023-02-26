attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_projection;


uniform mat4 u_camera;

uniform mat4 u_modelView;




varying vec3 v_normal;


void main() {
  gl_Position = u_projection * u_camera * u_modelView * a_position;

  v_normal = a_normal;
}