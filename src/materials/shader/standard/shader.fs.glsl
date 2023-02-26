
precision mediump float;


uniform vec3 u_color;


uniform float u_bias;



// 灯光颜色
uniform vec3 u_lightColor;
// 环境光颜色
uniform vec3 u_baseLightColor;

varying vec3 v_color;

varying vec3 v_normal;

varying vec3 v_fragToLight;

varying vec3 v_fragToCamera;

varying float v_fogDepth;

varying vec3 v_lightPosition;

varying vec2 v_texcoord;


// 阴影相关
varying vec4 v_projectedTexcoord;
// 深度纹理
uniform sampler2D u_projectedTexture;

void main(){

  vec3 color = u_color;
  vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
  float currentDepth = projectedTexcoord.z + u_bias;

  bool inRange =
      projectedTexcoord.x >= 0.0 &&
      projectedTexcoord.x <= 1.0 &&
      projectedTexcoord.y >= 0.0 &&
      projectedTexcoord.y <= 1.0;

  // the 'r' channel has the depth values
  float projectedDepth = texture2D(u_projectedTexture, projectedTexcoord.xy).r;
  float shadowLight = (inRange && projectedDepth <= currentDepth) ? 0.0 : 1.0;


   vec3 toLight = normalize(v_fragToLight);
   vec3 toView = normalize(v_fragToCamera);
   
   // 环境光 50%
   vec4 ambient=vec4(color * u_baseLightColor * 0.5,1.);

   // // 漫反射
   float diffuseAmt = dot(toLight, v_normal);
   // // 模型颜色 * 
   vec4 diffuse = vec4(color * u_lightColor * 0.2 * diffuseAmt, 1.0);


   vec3 halfVector = normalize(toView + toLight);
   float light = max(dot(v_normal,toView), 0.0);
   float specular=0.0;

   if (light > 0.0) {
      specular = pow(dot(v_normal, halfVector), 512.0);
   }

   vec4 specularColor = vec4(u_lightColor.rgb * specular, 1.0);

   vec4 frag = ambient + diffuse + specularColor;


      // gl_FragColor = mix(frag, projectedTexColor, projectedAmount);

  gl_FragColor = vec4(frag.rgb * shadowLight, frag.a);

  // gl_FragColor = frag;
}