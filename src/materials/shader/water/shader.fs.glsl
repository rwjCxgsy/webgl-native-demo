precision mediump float;

uniform vec3 u_color;
uniform sampler2D u_texture0;

// 深度纹理
uniform sampler2D u_texture1;

uniform float u_bias;

// 灯光颜色
uniform vec3 u_lightColor;

// 环境光颜色
uniform vec3 u_baseLightColor;

varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

varying mat3 TBN;

varying vec3 v_color;
varying vec2 v_uv;
varying vec2 v_uv2;

varying vec3 v_normal;

// 阴影相关

varying vec4 v_projectedTexcoord;

void main(){
   
   // 水的颜色
   vec3 warerColor=vec3(.2,.6,.7961);



  vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
  float currentDepth = projectedTexcoord.z + u_bias;

  bool inRange =
      projectedTexcoord.x >= 0.0 &&
      projectedTexcoord.x <= 1.0 &&
      projectedTexcoord.y >= 0.0 &&
      projectedTexcoord.y <= 1.0;

  // the 'r' channel has the depth values
  float projectedDepth = texture2D(u_texture1, projectedTexcoord.xy).r;
  bool shaodow = (inRange && projectedDepth <= currentDepth);
  float shadowLight = shaodow ? 0.5 : 1.0;

  // 如果在投影中 则 减少光亮 
  
   
   vec3 toLight=normalize(v_fragToLight);
   vec3 toView=normalize(v_fragToCamera);
   
   vec4 textureNormal1=texture2D(u_texture0,v_uv);
   vec4 textureNormal2=texture2D(u_texture0,v_uv2);
   vec3 normal1=vec3(textureNormal1)*2.-1.;
   vec3 normal2=vec3(textureNormal2)*2.-1.;
   vec3 normal=normalize(normal1+normal2);
   
   normal=normalize(TBN*normal);
   
   // normal = vec3(0.0, 1.0, 0.0);
   
   // 环境光 50%
   vec4 ambient=vec4(warerColor*u_baseLightColor,1.);
   
   // // 漫反射
   float diffuseAmt=dot(toLight,normal);
   // // 模型颜色 *
   vec4 diffuse=vec4(warerColor*u_lightColor *.2*diffuseAmt,1.);
   
   vec3 halfVector=normalize(toView+toLight);
   float light=max(dot(normal,toView),0.);
   float specular=0.;
   
   if(light>0. && !shaodow){
      specular=pow(dot(normal,halfVector),512.);
   }
   
   vec4 specularColor=vec4(u_lightColor.rgb * specular,1.);
   
   
   vec4 frag =ambient+diffuse+specularColor;
  gl_FragColor = vec4(frag.rgb * shadowLight, frag.a);


// 






}