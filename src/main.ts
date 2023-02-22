import * as wordF from './geometry/f';
import * as skyBox from './geometry/box';
import fs from './shader/shader.fs.glsl?raw';
import vs from './shader/shader.vs.glsl?raw';
import { createPlane } from './geometry/plane';
import { mat4 as ___mt4 } from './matrix';

console.log(createPlane(2, 1));

// import { Matrix4, PerspectiveCamera, Vector3 } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import skyBoxVs from './shader/skybox/shader.vs.glsl?raw';
import skyBoxFs from './shader/skybox/shader.fs.glsl?raw';

import GUI from 'lil-gui';
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
let u_modelView: WebGLUniformLocation;

// 天空盒
let skyBoxProgram: WebGLProgram;
let sky_a_position: number;
let sky_u_camera: WebGLUniformLocation;
let sky_u_projection: WebGLUniformLocation;
let sky_u_modelView: WebGLUniformLocation;
let sky_positionBuffer: WebGLBuffer;
let sky_u_texture: WebGLUniformLocation;

const skyTexture = gl.createTexture();

let Camera = ___mt4.perspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
let view = ___mt4.lookAt([300, 300, 300], [0, 0, 0], [0, 1, 0]);

const control = new OrbitControls(Camera, canvas);

function init() {
  // f字母

  {
    const vsShader = createShader(gl.VERTEX_SHADER, vs);
    const fsShader = createShader(gl.FRAGMENT_SHADER, fs);
    program = createShaderProgram(vsShader, fsShader);

    a_position = gl.getAttribLocation(program, 'a_position');
    a_color = gl.getAttribLocation(program, 'a_color');
    u_camera = gl.getUniformLocation(program, 'u_camera')!;
    u_projection = gl.getUniformLocation(program, 'u_projection')!;
    u_modelView = gl.getUniformLocation(program, 'u_modelView')!;
    console.log(a_color, a_position);
    positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, wordF.vertexes, gl.STATIC_DRAW);

    colorBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, wordF.colors, gl.STATIC_DRAW);
  }

  // 天空盒子

  {
    const vsShader = createShader(gl.VERTEX_SHADER, skyBoxVs);
    const fsShader = createShader(gl.FRAGMENT_SHADER, skyBoxFs);
    skyBoxProgram = createShaderProgram(vsShader, fsShader);

    sky_a_position = gl.getAttribLocation(skyBoxProgram, 'a_position');
    sky_u_camera = gl.getUniformLocation(skyBoxProgram, 'u_camera')!;
    sky_u_modelView = gl.getUniformLocation(skyBoxProgram, 'u_modelView')!;
    sky_u_projection = gl.getUniformLocation(skyBoxProgram, 'u_projection')!;
    sky_u_texture = gl.getUniformLocation(skyBoxProgram, 'u_texture')!;

    sky_positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, sky_positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, skyBox.vertexes, gl.STATIC_DRAW);

    let loadK = 0;
    [
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        path: '/assets/right.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        path: '/assets/left.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        path: '/assets/top.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        path: '/assets/bottom.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        path: '/assets/front.jpg',
      },
      {
        target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        path: '/assets/back.jpg',
      },
    ].forEach(({ target, path }) => {
      const image = new Image();
      image.onload = () => {
        const level = 0;
        const internalFormat = gl.RGBA;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyTexture);
        gl.texImage2D(target, level, internalFormat, format, type, image);
        loadK++;
        if (loadK >= 6) {
          console.log('加载完成');
          gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
          gl.texParameteri(
            gl.TEXTURE_CUBE_MAP,
            gl.TEXTURE_WRAP_S,
            gl.CLAMP_TO_EDGE
          );
          gl.texParameteri(
            gl.TEXTURE_CUBE_MAP,
            gl.TEXTURE_WRAP_T,
            gl.CLAMP_TO_EDGE
          );
          gl.texParameteri(
            gl.TEXTURE_CUBE_MAP,
            gl.TEXTURE_MIN_FILTER,
            gl.LINEAR_MIPMAP_LINEAR
          );
        }
      };
      image.src = path;
    });
  }
}
init();

function renderScene(camera: PerspectiveCamera) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Clear the canvas.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  {
    gl.disable(gl.DEPTH_TEST);
    // 渲染天空盒子
    gl.useProgram(skyBoxProgram);
    gl.enableVertexAttribArray(sky_a_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, sky_positionBuffer);
    gl.vertexAttribPointer(sky_a_position, 3, gl.FLOAT, false, 0, 0);
    // 传递参数
    gl.uniformMatrix4fv(
      sky_u_projection,
      false,
      camera.projectionMatrix.elements
    );

    gl.uniformMatrix4fv(
      sky_u_camera,
      false,
      camera.matrixWorldInverse.elements
    );

    const modelView = new Matrix4();

    const position = camera.position.clone();
    position.add(new Vector3(0, -100, 0));
    modelView.setPosition(position);

    gl.uniformMatrix4fv(sky_u_modelView, false, modelView.elements);
    gl.uniform1i(sky_u_texture, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
  }

  {
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);
    gl.enableVertexAttribArray(a_color);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);
    // 传递参数
    gl.uniformMatrix4fv(u_projection, false, camera.projectionMatrix.elements);
    gl.uniformMatrix4fv(u_camera, false, camera.matrixWorldInverse.elements);
    gl.uniformMatrix4fv(u_modelView, false, new Matrix4().elements);
    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
  }
}

function animate(time: number) {
  requestAnimationFrame(animate);
  renderScene(Camera);
}
requestAnimationFrame(animate);

control.addEventListener('change', () => {});
