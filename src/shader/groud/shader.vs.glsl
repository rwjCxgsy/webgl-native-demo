attribute vec4 a_position;

uniform mat4 u_projection;

uniform mat4 u_camera;

void main() {
  gl_Position = u_projection * u_camera * a_position;
}