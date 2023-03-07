precision mediump float;

uniform vec3 u_color;

varying vec3 a_normal;
varying vec2 v_texcoord;

uniform sampler2D u_texture0;




void main() {
   
   gl_FragColor = texture2D(u_texture0, v_texcoord);

   bvec4 e = equal(gl_FragColor, vec4(0.0, 0.0, 0.0, 1.0));
   if (all(e)) {
      gl_FragColor = vec4(u_color,  1.0);
   }
}