precision mediump float;

uniform sampler2D u_texture0; // 基础颜色纹理
uniform sampler2D u_texture1; // 过程纹理
uniform sampler2D u_texture2; // 大理石
uniform sampler2D u_texture3; // 花冈石
uniform sampler2D u_texture4; // 土地
uniform sampler2D u_texture5; // 草地

uniform vec3 u_color;


uniform float u_bias;

// 灯光颜色
uniform vec3 u_lightColor;

// 环境光颜色
uniform vec3 u_baseLightColor;

varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

// varying mat3 TBN;

varying vec3 v_color;
varying vec2 v_uv;
varying vec2 v_uv2;

// 阴影相关

varying vec4 v_projectedTexcoord;



// 深度纹理
uniform sampler2D u_projectedTexture;

varying vec2 v_texcoord;

varying vec3 v_normal;

void main(){
   



  vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
  float currentDepth = projectedTexcoord.z + u_bias;

  bool inRange =
      projectedTexcoord.x >= 0.0 &&
      projectedTexcoord.x <= 1.0 &&
      projectedTexcoord.y >= 0.0 &&
      projectedTexcoord.y <= 1.0;

  // the 'r' channel has the depth values
  float projectedDepth = texture2D(u_texture0, projectedTexcoord.xy).r;
  float shadowLight = (inRange && projectedDepth <= currentDepth) ? 0.5 : 1.0;

  // 如果在投影中 则 减少光亮 
  
   
   vec3 toLight=normalize(v_fragToLight);
   vec3 toView=normalize(v_fragToCamera);
   
  //  vec4 textureNormal1=texture2D(u_texture0,v_uv);
  //  vec4 textureNormal2=texture2D(u_texture0,v_uv2);
  //  vec3 normal1=vec3(textureNormal1)*2.-1.;
  //  vec3 normal2=vec3(textureNormal2)*2.-1.;
  //  vec3 normal=normalize(normal1+normal2);
   
  //  normal=normalize(TBN*normal);

  // vec3 normal = vec3(1.0, 0.0, 0.0);
   
   vec3 normal = v_normal;






  // 基础颜色
   vec4 baseColor=texture2D(u_texture0, v_texcoord);

  float dtScale1=27.0;                 //细节纹理1 的缩放系数
  float dtScale2=20.00;                 //细节纹理2 的缩放系数
  float dtScale3=6.0;                 //细节纹理3 的缩放系数
  float dtScale4=6.0;                 //细节纹理4 的缩放系数
  float ctSize=257.00;                  //地形灰度图的尺寸（以像素为单位）
  float factor1=ctSize/dtScale1;        //细节纹理1 的纹理坐标缩放系数
  float factor2=ctSize/dtScale2;        //细节纹理2 的纹理坐标缩放系数
  float factor3=ctSize/dtScale3;        //细节纹理3 的纹理坐标缩放系数
  float factor4=ctSize/dtScale4;        //细节纹理4 的纹理坐标缩放系数

  // 各种颜色取色系数 
   vec4 qsxs = texture2D(u_texture1, v_texcoord);
  vec4 color_bigRock = texture2D(u_texture2, v_texcoord * factor1) * qsxs.r;
  vec4 color_rock = texture2D(u_texture3, v_texcoord * factor2) * qsxs.g;
  vec4 color_hardDirt = texture2D(u_texture4, v_texcoord * factor3) * qsxs.b;
  vec4 color_grass = texture2D(u_texture5, v_texcoord * factor4) * qsxs.a;

  // 计算后的地形颜色
  vec3 color = (color_bigRock + color_rock + color_hardDirt + color_grass + baseColor - 0.5).rgb;

   // 环境光 50%
   vec4 ambient=vec4(color*u_baseLightColor,1.);
   
   // // 漫反射
   float diffuseAmt=dot(toLight,normal);
   // // 模型颜色 *
   vec4 diffuse=vec4(color*u_lightColor *.2*diffuseAmt,1.);
   
   vec3 halfVector=normalize(toView+toLight);
   float light=max(dot(normal,toView),0.);
   float specular=0.;
   
   if(light>0.){
      specular=pow(dot(normal,halfVector),512.);
   }
   
   vec4 specularColor=vec4(u_lightColor.rgb  *specular,1.);
   
   
   vec4 frag =ambient + 0.1;
  gl_FragColor = frag;


  // gl_FragColor = vec4(normal, 1.0);


// 






}