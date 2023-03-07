const fragV = /** glsl */ `
  // 阴影lookat 矩阵 相关参数
  uniform mat4 u_textureMatrix;
  // 阴影投影矩阵
  varying vec4 v_projectedTexcoord;
  // 深度纹理
  uniform sampler2D u_projectedTexture;
`;

const fragC = /** glsl */ `
vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
float currentDepth = projectedTexcoord.z + u_bias;

bool inRange = projectedTexcoord.x >= -1.0 &&
  projectedTexcoord.x <= 1. &&
  projectedTexcoord.y >= -1.0 &&
  projectedTexcoord.y <= 1.;


vec2 uv = (vec2(projectedTexcoord.xy) + 1.0) / 2.0;
float projectedDepth = texture2D(u_projectedTexture, uv.xy).r;
shadowLight = (inRange && projectedDepth <= currentDepth) ? 0.0 : 1.0;
`;

const vertV = /**glsl*/ `
// 阴影lookat 矩阵 相关参数
uniform mat4 u_textureMatrix;
  // 阴影投影矩阵
varying vec4 v_projectedTexcoord;
`;

const vertC = `
  // 阴影
  v_projectedTexcoord = u_textureMatrix * worldPosition;
`;

export { fragV, fragC, vertC, vertV };
