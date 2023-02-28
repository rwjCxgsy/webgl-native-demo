precision mediump float;

uniform vec3 u_color;

varying vec3 a_normal;
varying vec2 v_texcoord;

varying float v_fogDepth;

void main() {

      vec3 u_fogColor = vec3(1.0, 1.0, 1.0);
        float fogAmount = smoothstep(400.0, 500.0, v_fogDepth);
     gl_FragColor = vec4(mix(u_color, u_fogColor, fogAmount), 1.0);  
}