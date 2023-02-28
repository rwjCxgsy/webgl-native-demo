precision mediump float;

uniform vec3 u_color;
uniform sampler2D u_texture0;

// 深度纹理
uniform sampler2D u_projectedTexture;

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

uniform float u_isRenderShadowTexture;

varying float v_fogDepth;

void main(){
   
   // 水的颜色
   vec3 warerColor=vec3(0.0002, 0.472, 0.619);
     float u_bias = 0.0001;
   
  vec3 projectedTexcoord=v_projectedTexcoord.xyz/v_projectedTexcoord.w;
    float currentDepth=projectedTexcoord.z + u_bias;
    
    bool inRange=
    projectedTexcoord.x>=-1.0 &&
    projectedTexcoord.x<=1.&&
    projectedTexcoord.y>=-1.0 &&
    projectedTexcoord.y<=1.;
    
    // the 'r' channel has the depth values

    vec2 uv = (vec2(projectedTexcoord.xy) + 1.0) / 2.0; 
    float projectedDepth=texture2D(u_projectedTexture,uv.xy).r;
    float shadowLight=(inRange && projectedDepth <= currentDepth) ? 0.5 : 1.0;
      
   
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
   vec4 ambient=vec4(warerColor*u_baseLightColor * 0.77 * shadowLight,1.);
   
   // // 漫反射
   float diffuseAmt=max(dot(toLight,normal), 0.0);
   // // 模型颜色 *
   vec4 diffuse=vec4(warerColor*u_lightColor*.23*diffuseAmt,1.);
   
   vec3 halfVector=normalize(toView+toLight);
   float light=max(dot(normal,toView),0.);
   float specular=0.;
   
   if(light>0.&&shadowLight==1.){
      specular=pow(max(dot(normal,halfVector), 0.0),512.);
   }
   
   vec4 specularColor=vec4(u_lightColor.rgb*specular,1.);
   
   vec4 frag=ambient+diffuse+specularColor;

         vec4 u_fogColor = vec4(1.0, 1.0, 1.0, 1.0);
        float fogAmount = smoothstep(180.0, 300.0, v_fogDepth);


   gl_FragColor= mix(frag, u_fogColor, fogAmount);

}