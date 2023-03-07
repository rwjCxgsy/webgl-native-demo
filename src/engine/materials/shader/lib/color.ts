export const fragC = `

vec3 toLight=normalize(v_fragToLight);
vec3 toView=normalize(v_fragToCamera);

// 环境光 50%
vec4 ambient = vec4(color * u_ambientColor * .77, 1.);

float diffuseAmt = max(dot(toLight, normal), 0.0);
vec4 diffuse = vec4(color * u_diffuseColor * .23 * diffuseAmt * shadowLight, 1.);

vec3 halfVector = normalize(toView + toLight);
float light = max(dot(normal, toView), 0.);
float specular = 0.;

if(light > 0.) {
  specular = pow(max(dot(normal, halfVector), 0.0), 412.);
}

vec4 specularColor = vec4(u_diffuseColor.rgb * abs(specular * shadowLight), 1.);

vec4 frag = ambient + diffuse + specularColor;
color = frag.rgb;
`;
