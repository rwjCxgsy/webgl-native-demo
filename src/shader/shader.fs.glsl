
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

void main(){
   
   // 因为法向量存在负方向 所以颜色为黑色
   // gl_FragColor = vec4(v_normal, 1.0);
   
   vec3 halfVector=normalize(v_fragToLight+v_fragToCamera);
   
   // 计算漫反射
   float light=dot(v_normal,v_fragToLight);
   
   // 添加高光
   float specular=0.;
   if(light>0.){
      specular=pow(dot(v_normal,halfVector),100.);
   }
   
   vec4 specularColor=vec4(v_color.rgb*light,1.);
   specularColor.rgb+=specular;
   
   gl_FragColor=vec4(u_baseLightColor,1.)+specularColor;
   
}