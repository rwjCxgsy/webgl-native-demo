precision mediump float;

uniform vec3 u_color;




uniform float u_bias;


// 灯光颜色
uniform vec3 u_diffuseColor;
// 环境光颜色
uniform vec3 u_ambientColor;



varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

varying mat3 TBN;


varying vec2 v_texcoord;

varying vec3 v_color;
varying vec2 v_uv;
varying vec2 v_uv2;

varying vec3 v_normal;

// 阴影相关
#include <shadow-fv>
#include <texture-fv>


varying float v_fogDepth;

void main(){
   
   // 水的颜色
   vec3 color=vec3(0.0002, 0.472, 0.619);

   float shadowLight = 1.0;
   vec3 normal = v_normal;
   #include <shadow-fc>
      
   
   
   vec4 textureNormal1=texture2D(u_texture0,v_uv);
   vec4 textureNormal2=texture2D(u_texture0,v_uv2);
   vec3 normal1=vec3(textureNormal1)*2.-1.;
   vec3 normal2=vec3(textureNormal2)*2.-1.;
   normal=normalize(normal1+normal2);
   normal=normalize(TBN*normal);



   #include <color-fc>

   // vec4 u_fogColor = vec4(1.0, 1.0, 1.0, 1.0);
   // float fogAmount = smoothstep(180.0, 300.0, v_fogDepth);


   // gl_FragColor= mix(color, u_fogColor, fogAmount);




  gl_FragColor = vec4(color, 1.0);

}