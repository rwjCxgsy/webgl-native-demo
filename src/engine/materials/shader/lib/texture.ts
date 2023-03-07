const fragV = /** glsl */ `
// 纹理
uniform sampler2D u_texture0;
`;

const fragC = /** glsl */ `
  color = texture2D(u_texture0, v_texcoord).rgb;
`;

export { fragV, fragC };
