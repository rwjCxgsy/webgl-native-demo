attribute vec4 a_position;

uniform mat4 u_projection;

uniform mat4 u_camera;

varying vec3 v_normal;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_projection * u_camera * a_position;

  // Pass a normal. Since the positions
  // centered around the origin we can just 
  // pass the position
  v_normal = normalize(a_position.xyz);
}