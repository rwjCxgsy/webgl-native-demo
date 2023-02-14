import { mat4, vec3, vec4 } from 'gl-matrix';
import * as wordF from './geometry/f';
import fs from './shader/shader.fs.glsl?raw';
import vs from './shader/shader.vs.glsl?raw';
import GUI from 'lil-gui';
import './index.css';

const canvas = document.querySelector('#root') as HTMLCanvasElement;
const gl = canvas.getContext('webgl')!;

function initCanvas() {
  canvas.width =
    (window.innerWidth || document.documentElement.clientWidth) *
    window.devicePixelRatio;
  (canvas.height =
    window.innerHeight || document.documentElement.clientHeight) *
    window.devicePixelRatio;
  canvas.style.width =
    (window.innerWidth || document.documentElement.clientWidth) + 'px';
  canvas.style.height =
    (window.innerHeight || document.documentElement.clientHeight) + 'px';
}

initCanvas();

function createShader(type: number, shaderContent: string) {
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
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('program error');
  }
  return program;
}

let program: WebGLProgram;
let a_position: number;
let a_color: number;
let u_camera: WebGLUniformLocation;
let u_projection: WebGLUniformLocation;
let positionBuffer: WebGLBuffer;
let colorBuffer: WebGLBuffer;

let perspectiveMatrix: mat4 = mat4.create();
mat4.perspective(
  perspectiveMatrix,
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

let cameraMatrix: mat4 = mat4.create();
let cameraPosition: vec3 = [500, 500, 500];
mat4.lookAt(cameraMatrix, cameraPosition, [0, 0, 0], [0, 1, 0]);

function init() {
  const vsShader = createShader(gl.VERTEX_SHADER, vs);
  const fsShader = createShader(gl.FRAGMENT_SHADER, fs);
  program = createShaderProgram(vsShader, fsShader);

  a_position = gl.getAttribLocation(program, 'a_position');
  a_color = gl.getAttribLocation(program, 'a_color');
  u_camera = gl.getUniformLocation(program, 'u_camera')!;
  u_projection = gl.getUniformLocation(program, 'u_projection')!;
  console.log(a_color, a_position);
  positionBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, wordF.vertexes, gl.STATIC_DRAW);

  colorBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, wordF.colors, gl.STATIC_DRAW);
}
init();

function renderScene(proMatrix: mat4) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);

  gl.enableVertexAttribArray(a_color);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_position);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

  // 传递参数

  gl.uniformMatrix4fv(u_projection, false, proMatrix);
  gl.uniformMatrix4fv(u_camera, false, cameraMatrix);

  gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
}

function animate() {
  requestAnimationFrame(animate);

  renderScene(perspectiveMatrix);
}
requestAnimationFrame(animate);

const gui = new GUI();

gui.add({ cameraX: 20 }, 'cameraX', -1000, 1000).onChange((val: number) => {
  cameraPosition[0] = val;
  mat4.lookAt(cameraMatrix, cameraPosition, [0, 0, 0], [0, 1, 0]);
}); // checkbox
gui.add({ cameraY: 20 }, 'cameraY', -1000, 1000).onChange((val: number) => {
  cameraPosition[1] = val;
  mat4.lookAt(cameraMatrix, cameraPosition, [0, 0, 0], [0, 1, 0]);
}); // checkbox
gui.add({ cameraZ: 20 }, 'cameraZ', -1000, 1000).onChange((val: number) => {
  cameraPosition[2] = val;
  mat4.lookAt(cameraMatrix, cameraPosition, [0, 0, 0], [0, 1, 0]);
}); // checkbox
