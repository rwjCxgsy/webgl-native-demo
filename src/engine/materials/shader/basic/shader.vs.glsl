attribute vec4 a_position;

attribute vec3 a_normal;

attribute vec2 a_texcoord;


// 相机三剑客

uniform mat4 u_projection;


uniform mat4 u_camera;

uniform mat4 u_modelView;

// 法线

varying vec3 v_normal;


varying vec2 v_texcoord;

void main() {
  gl_Position = u_projection * u_camera * u_modelView * a_position;

  v_normal = a_normal;

  v_texcoord = a_texcoord;
}