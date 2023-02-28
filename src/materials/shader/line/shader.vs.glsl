attribute vec4 a_position;




// 相机三剑客

uniform mat4 u_projection;


uniform mat4 u_camera;

uniform mat4 u_modelView;


void main() {
  gl_Position = u_projection * u_camera * u_modelView * a_position;


}