import { createShaderContent } from './engine/materials/shader/lib';
import { Material } from './engine/materials/Material';
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

function createShaderProgram(gl: WebGLRenderingContext, material: Material) {
  createShaderContent(material);

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, material.vs);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, material.fs);
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('program error');
  }
  return program;
}

export { createShaderProgram };
