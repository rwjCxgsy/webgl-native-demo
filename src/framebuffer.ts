import * as THREE from 'three';
import { Camera, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './index.css';

const canvas = document.querySelector('#root') as HTMLCanvasElement;
const gl = canvas.getContext('webgl', { antialias: true })!;
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

const vs = `
attribute vec4 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;
uniform mat4 u_projection;

varying vec2 v_texcoord;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_projection * u_matrix * a_position;

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
`;

const fs = `
precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
  // gl_FragColor = vec4(1.0, 0.3, 0.5, 1.0);
}
`;

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  2000
);

camera.position.set(5, 5, 5);

const control = new OrbitControls(camera, canvas);

const frameBuffer = gl.createFramebuffer()!;

let program: WebGLProgram;

let a_position_location: number;
let a_texcoord_location: number;
let u_matrix_location: WebGLUniformLocation;
let u_projection_location: WebGLUniformLocation;
let u_texture_location: WebGLUniformLocation;

let positionBuffer = gl.createBuffer();
let texcoordBuffer = gl.createBuffer();
const texture = gl.createTexture()!;
const targetTexture = gl.createTexture();

function createShader(type: number, content: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, content);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader)!);
  }
  return shader;
}

function createProgram() {
  const vsShader = createShader(gl.VERTEX_SHADER, vs);
  const fsShader = createShader(gl.FRAGMENT_SHADER, fs);

  program = gl.createProgram()!;
  gl.attachShader(program, vsShader);
  gl.attachShader(program, fsShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program)!);
  }
}

function init() {
  a_position_location = gl.getAttribLocation(program, 'a_position');
  a_texcoord_location = gl.getAttribLocation(program, 'a_texcoord');
  u_matrix_location = gl.getUniformLocation(program, 'u_matrix')!;
  u_projection_location = gl.getUniformLocation(program, 'u_projection')!;
  u_texture_location = gl.getUniformLocation(program, 'u_texture')!;

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  setTexcoords(gl);

  {
    // fill texture with 3 * 2 pixels
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      3,
      2,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      new Uint8Array([128, 64, 128, 0, 192, 0])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  {
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      256,
      256,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );

    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  // bind the framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    targetTexture,
    0
  );

  render();
}

createProgram();

init();

function renderScene(camera: Camera) {
  gl.useProgram(program);

  // 渲染frameBuffer
  {
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.clearColor(0, 0, 1, 1); // clear to blue
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, 256, 256);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    renderCube();
  }

  // 渲染scene
  {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.bindTexture(gl.TEXTURE_2D, targetTexture);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    renderCube();
  }
}

function renderCube() {
  gl.uniformMatrix4fv(
    u_projection_location,
    false,
    camera.projectionMatrix.elements
  );
  gl.uniformMatrix4fv(
    u_matrix_location,
    false,
    camera.matrixWorldInverse.elements
  );

  gl.uniform1i(u_texture_location, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(a_position_location);
  gl.vertexAttribPointer(a_position_location, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.enableVertexAttribArray(a_texcoord_location);
  gl.vertexAttribPointer(a_texcoord_location, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function render() {
  requestAnimationFrame(render);
  renderScene(camera);
}

function setGeometry(gl: WebGLRenderingContext) {
  var positions = new Float32Array([
    -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
    0.5, -0.5, 0.5, -0.5, -0.5,

    -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
    0.5, 0.5, 0.5, 0.5,

    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, -0.5,

    -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5, -0.5, 0.5,

    -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5, 0.5, -0.5,

    0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5, 0.5,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the buffer with texture coordinates the cube.
function setTexcoords(gl: WebGLRenderingContext) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

      0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,

      0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

      0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,

      0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

      0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1,
    ]),
    gl.STATIC_DRAW
  );
}
