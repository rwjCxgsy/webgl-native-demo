
precision mediump float;

// Passed in from the vertex shader.
varying vec4 v_color;

varying vec3 v_normal;


uniform vec3 u_lightColor;


varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;



void main() {


   // 因为法向量存在负方向 所以颜色为黑色
   // gl_FragColor = vec4(v_normal, 1.0);

   // 计算漫反射
   float light = dot(v_normal, v_fragToLight);

   vec3 baseLight = vec3(0.3, 0.3, 0.3);
   gl_FragColor = vec4(baseLight + vec3(v_color) * light, 1.0);
}