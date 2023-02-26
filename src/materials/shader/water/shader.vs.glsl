

attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec3 a_color;
attribute vec2 a_texcoord;

uniform mat4 u_projection;

uniform mat4 u_camera;

uniform mat4 u_modelView;

// 灯光位置
uniform vec3 u_lightPosition;

// 相机位置
uniform vec3 u_cameraPosition;

uniform float u_time;

varying vec3 v_color;

varying vec2 v_uv;

varying vec2 v_uv2;

// 计算点到灯光向量
varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;


varying mat3 TBN; 


varying vec3 v_normal;


// 阴影lookat 矩阵 相关参数
uniform mat4 u_textureMatrix;
// 阴影投影矩阵
varying vec4 v_projectedTexcoord;


void main() {

  vec4 worldPosition = u_modelView * a_position;

  gl_Position = u_projection * u_camera * worldPosition;
  v_color = a_color;


  float v_t = u_time * 0.00004;
  float v_t2 = u_time * 0.00003;
  v_uv = vec2(a_texcoord.x + v_t, a_texcoord.y) * 3.0;
  v_uv2 = vec2(a_texcoord.x + v_t2, a_texcoord.y - v_t2) * 2.0;
  
  vec3 T = vec3(0, 0, 1);
  vec3 B = vec3(1, 0, 0);
  vec3 N = vec3(0, 1, 0);

  TBN = mat3(T, B, N);

  TBN = TBN;

    // 转换后的世界坐标位置
  // vec4 position=u_camera * u_modelView*a_position;
  
  // 计算点到灯光向量
  // v_fragToLight=vec3(0.0, 0.0, 200)-vec3(a_position);
  v_fragToLight=u_lightPosition-vec3(worldPosition);
  
  v_fragToCamera=u_cameraPosition-vec3(u_camera * worldPosition);

  // 阴影
  v_projectedTexcoord = u_textureMatrix * worldPosition;

  v_normal = a_normal;
}