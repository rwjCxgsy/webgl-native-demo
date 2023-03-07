

attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_projection;

uniform mat4 u_camera;

uniform mat4 u_modelView;

// 灯光位置
uniform vec3 u_lightPosition;

// 相机位置
uniform vec3 u_cameraPosition;

uniform float u_time;


varying vec2 v_uv;

varying vec2 v_uv2;

// 计算点到灯光向量
varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;


// varying mat3 TBN; 


// 阴影lookat 矩阵 相关参数
uniform mat4 u_textureMatrix;
// 阴影投影矩阵
varying vec4 v_projectedTexcoord;

varying vec2 v_texcoord;

varying vec3 v_normal;


void main() {

  vec4 worldPosition = u_modelView * a_position;

  gl_Position = u_projection * u_camera * worldPosition;





    // 转换后的世界坐标位置
  // vec4 position=u_camera * u_modelView*a_position;
  
  // 计算点到灯光向量
  // v_fragToLight=vec3(0.0, 0.0, 200)-vec3(a_position);
  v_fragToLight=u_lightPosition-vec3(worldPosition);
  
  v_fragToCamera=u_cameraPosition-vec3(u_camera * worldPosition);

  // 阴影
  v_projectedTexcoord = u_textureMatrix * worldPosition;
v_texcoord = a_texcoord;
v_normal = a_normal;
}