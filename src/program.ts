function createShader(
  gl: WebGLRenderingContext,
  type: number,
  shaderContent: string
) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, shaderContent);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    throw new Error('shader error');
  }
  return shader;
}

function createShaderProgram(
  gl: WebGLRenderingContext,
  vertexShaderContent: string,
  fragmentShaderContent: string
) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderContent);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderContent
  );
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(program));
    throw new Error('program error');
  }
  return program;
}

interface Attributes {
  uv?: Float32Array;
  position: Float32Array;
  color?: Float32Array;
  normal?: Float32Array;
}

export { createShaderProgram };
