attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_projection;

uniform mat4 u_camera;

uniform mat4 u_modelView;

varying vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_projection * u_camera * u_modelView * a_position;

  // Pass the color to the fragment shader.
  v_color = vec4(a_color.xyz/255.0, 1.0);
}
