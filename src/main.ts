import { mat3, mat4, vec3, vec4 } from 'gl-matrix';
import * as wordF from './geometry/f';
import * as skyBox from './geometry/box';
import fs from './shader/shader.fs.glsl?raw';
import vs from './shader/shader.vs.glsl?raw';

import skyBoxVs from './shader/skybox/shader.vs.glsl?raw';
import skyBoxFs from './shader/skybox/shader.fs.glsl?raw';

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

// 天空盒
let skyBoxProgram: WebGLProgram;
let sky_a_position: number;
let sky_u_camera: WebGLUniformLocation;
let sky_u_projection: WebGLUniformLocation;
let sky_positionBuffer: WebGLBuffer;
let sky_u_texture: WebGLUniformLocation;

const skyTexture = gl.createTexture();

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
mat4.lookAt(cameraMatrix, cameraPosition, [0, 0, 0], [0, -1, 0]);

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

function renderScene(proMatrix: mat4) {
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
    gl.uniformMatrix4fv(sky_u_projection, false, proMatrix);

    // const matrix3 = mat3.create();

    // mat3.fromMat4(matrix3, cameraMatrix);

    const view = mat4.create();

    mat4.set(
      view,
      cameraMatrix[0],
      cameraMatrix[1],
      cameraMatrix[2],
      0,
      cameraMatrix[4],
      cameraMatrix[5],
      cameraMatrix[6],
      0,
      cameraMatrix[8],
      cameraMatrix[9],
      cameraMatrix[10],
      0,
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
      1
    );

    gl.uniformMatrix4fv(sky_u_camera, false, view);
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
    gl.uniformMatrix4fv(u_projection, false, proMatrix);
    gl.uniformMatrix4fv(u_camera, false, cameraMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
  }
}

function generateSkyBox() {
  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      faceColor: '#F00',
      textColor: '#0FF',
      text: '+X',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      faceColor: '#FF0',
      textColor: '#00F',
      text: '-X',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      faceColor: '#0F0',
      textColor: '#F0F',
      text: '+Y',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      faceColor: '#0FF',
      textColor: '#F00',
      text: '-Y',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      faceColor: '#00F',
      textColor: '#FF0',
      text: '+Z',
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      faceColor: '#F0F',
      textColor: '#0F0',
      text: '-Z',
    },
  ];
  faceInfos.forEach((faceInfo) => {
    const { target, faceColor, textColor, text } = faceInfo;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    gl.texImage2D(target, level, internalFormat, format, type, new Image());
  });
}

function animate(time: number) {
  requestAnimationFrame(animate);
  renderScene(perspectiveMatrix);

  const position = vec3.clone(cameraPosition);
  const distance = vec3.length(position);

  // const x = Math.cos(time / 1000) * distance;
  // const y = Math.sin(time / 1000) * distance;
  // const z = position[2];
  // mat4.lookAt(cameraMatrix, [x, y, z], [0, 0, 0], [0, -1, 0]);
}
requestAnimationFrame(animate);

const gui = new GUI();

gui.add({ cameraX: 20 }, 'cameraX', -1000, 1000).onChange((val: number) => {
  cameraPosition[0] = val;
  mat4.lookAt(cameraMatrix, cameraPosition, [0, 0, 0], [0, -1, 0]);
}); // checkbox
gui.add({ cameraY: 20 }, 'cameraY', -1000, 1000).onChange((val: number) => {
  cameraPosition[1] = val;
  mat4.lookAt(cameraMatrix, cameraPosition, [0, 0, 0], [0, -1, 0]);
}); // checkbox
gui.add({ cameraZ: 20 }, 'cameraZ', -1000, 1000).onChange((val: number) => {
  cameraPosition[2] = val;
  mat4.lookAt(cameraMatrix, cameraPosition, [0, 0, 0], [0, -1, 0]);
}); // checkbox
