attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;
attribute vec2 a_texcoord;

uniform mat4 u_projection;

uniform mat4 u_camera;

uniform mat4 u_modelView;

varying vec3 v_color;

varying vec3 v_normal;

// 灯光位置
uniform vec3 u_lightPosition;

// 相机位置
uniform vec3 u_cameraPosition;

// 计算点到灯光向量
varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

varying float v_fogDepth;
varying vec3 v_lightPosition;

// 阴影lookat 矩阵 相关参数
uniform mat4 u_textureMatrix;
// 阴影投影矩阵
varying vec4 v_projectedTexcoord;

varying vec2 v_texcoord;

void main(){


  vec4 worldPosition = u_modelView*a_position;

  gl_Position=u_projection*u_camera*worldPosition;
  
  v_color=a_color.xyz/255.;
  
  v_normal=normalize(mat3(u_modelView) * a_normal);
  
  // 计算点到灯光向量
  v_fragToLight=u_lightPosition-vec3(worldPosition);
  
  v_fragToCamera=u_cameraPosition-vec3(u_camera * worldPosition);

    v_fogDepth = -worldPosition.z;

    v_lightPosition = u_lightPosition;


      // 阴影
  v_projectedTexcoord = u_textureMatrix * worldPosition;

  v_texcoord = a_texcoord;
}
