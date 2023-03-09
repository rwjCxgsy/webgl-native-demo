    precision mediump float;

    uniform sampler2D u_texture;
    uniform float u_threshold;

    varying vec2v_texcoord;

    void main() {
        float x0y0 = texture2D(u_texture, v_texcoord + vec2(-1.0, -1.0) / 512.0).r;
        float x1y0 = texture2D(u_texture, v_texcoord + vec2( 0.0, -1.0) / 512.0).r;
        float x2y0 = texture2D(u_texture, v_texcoord + vec2( 1.0, -1.0) / 512.0).r;
        float x0y1 = texture2D(u_texture, v_texcoord + vec2(-1.0,  0.0) / 512.0).r;
        float x1y1 = texture2D(u_texture, v_texcoord + vec2( 0.0,  0.0) / 512.0).r;
        float x2y1 = texture2D(u_texture, v_texcoord + vec2( 1.0,  0.0) / 512.0).r;
        float x0y2 = texture2D(u_texture, v_texcoord + vec2(-1.0,  1.0) / 512.0).r;
        float x1y2 = texture2D(u_texture, v_texcoord + vec2( 0.0,  1.0) / 512.0).r;
        float x2y2 = texture2D(u_texture, v_texcoord + vec2( 1.0,  1.0) / 512.0).r;
    
        float edgeValue = abs(-x0y0 - 2.0 * x1y0 - x2y0 + x0y2 + 2.0 * x1y2 + x2y2) +
                          abs(-x0y0 - 2.0 * x0y1 - x0y2 + x2y0 + 2.0 * x2y1 + x2y2);
        edgeValue = clamp(edgeValue - u_threshold, 0.0, 1.0);
    
        gl_FragColor = vec4(vec3(edgeValue), 1.0);
    }