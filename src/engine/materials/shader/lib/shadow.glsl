// 阴影相关
varying vec4 v_projectedTexcoord;
// 深度纹理
uniform sampler2D u_projectedTexture;


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
    shadowLight=(inRange && projectedDepth <= currentDepth) ? 0.0 : 1.0;