
precision mediump float;

// Passed in from the vertex shader.
varying vec4 v_color;

varying vec3 v_normal;

// 灯光颜色
uniform vec3 u_lightColor;
// 环境光颜色
uniform vec3 u_baseLightColor;


varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;



void main() {


   // 因为法向量存在负方向 所以颜色为黑色
   // gl_FragColor = vec4(v_normal, 1.0);

   // 计算漫反射
   float light1 = dot(v_normal, v_fragToLight);

   float light2 = dot(v_normal, v_fragToCamera);

   // gl_FragColor = vec4(0.0, light2, 0.0, 1.0);
   gl_FragColor = vec4(vec3(0.4, 0.4, 0.4) + vec3(v_color) * light1, 1.0);
}