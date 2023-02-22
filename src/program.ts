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

function getLocation(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  options: {
    attribute: Attributes;
  }
) {
  const buffers: {
    uv?: WebGLBuffer;
    position?: WebGLBuffer;
    color?: WebGLBuffer;
    normal?: WebGLBuffer;
  } = {};
  Object.entries(options.attribute).forEach((keyVal) => {
    const [key, data] = keyVal;
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    // @ts-ignore
    buffers[key] = buffer;
  });

  return {
    buffers,
    locations: {
      a_position: gl.getAttribLocation(program, 'a_position'),
      a_color: gl.getAttribLocation(program, 'a_color'),
      a_normal: gl.getAttribLocation(program, 'a_normal'),
      u_projection: gl.getUniformLocation(program, 'u_projection'),
      u_camera: gl.getUniformLocation(program, 'u_camera'),
      u_modelView: gl.getUniformLocation(program, 'u_modelView'),
    },
  };
}

export { createShaderProgram, getLocation };
