attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;

uniform mat4 u_projection;

uniform mat4 u_camera;

uniform mat4 u_modelView;

varying vec4 v_color;

varying vec3 v_normal;

// 灯光位置
uniform vec3 u_lightPosition;

// 相机位置
uniform vec3 u_cameraPosition;


// 计算点到灯光向量
varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_projection * u_camera * u_modelView * a_position;

  // Pass the color to the fragment shader.
  v_color = vec4(a_color.xyz/255.0, 1.0);



  v_normal = normalize(mat3(u_camera) * a_normal);



  // 转换后的世界坐标位置
  vec4 position = u_modelView * a_position;


  // 计算点到灯光向量
  v_fragToLight = normalize(u_lightPosition - vec3(position));

  v_fragToCamera = normalize(u_cameraPosition - vec3(position));
}
