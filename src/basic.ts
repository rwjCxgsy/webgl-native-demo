import * as wordF from './geometry/f';
import * as skyBox from './geometry/box';
import fs from './shader/shader.fs.glsl?raw';
import vs from './shader/shader.vs.glsl?raw';
import skyBoxVs from './shader/skybox/shader.vs.glsl?raw';
import skyBoxFs from './shader/skybox/shader.fs.glsl?raw';
import { createPlane } from './geometry/plane';
import { createShaderProgram, getLocation } from './program';

import { mat4, vec3 } from 'gl-matrix';

import './index.css';

import GUI from 'lil-gui';

const gui = new GUI();

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

const program = createShaderProgram(gl, vs, fs);

// 字母F

let outPosition = new Float32Array(wordF.vertexes.slice());

{
  var matrix = mat4.create();
  mat4.rotateX(matrix, mat4.create(), Math.PI);
  mat4.translate(matrix, matrix, [-50, -75, -15]);

  for (var ii = 0; ii < wordF.vertexes.length; ii += 3) {
    const out = vec3.create();
    const point = vec3.create();
    point[0] = wordF.vertexes[ii + 0];
    point[1] = wordF.vertexes[ii + 1];
    point[2] = wordF.vertexes[ii + 2];
    var vector = vec3.transformMat4(out, point, matrix);
    outPosition[ii + 0] = out[0];
    outPosition[ii + 1] = out[1];
    outPosition[ii + 2] = out[2];
  }
}
const entityWordF = getLocation(gl, program, {
  attribute: {
    normal: wordF.normals,
    position: outPosition,
    color: wordF.colors,
  },
});

// 发光源相关参数

// 光相关参数
const u_lightColor = gl.getUniformLocation(program, 'u_lightColor');
const u_lightPosition = gl.getUniformLocation(program, 'u_lightPosition');

const u_cameraPosition = gl.getUniformLocation(program, 'u_cameraPosition');

console.log(u_lightColor, u_lightPosition, u_cameraPosition);

// 相机位置
let cameraPosition: vec3 = [0, 0, 400];

// 添加灯光
let pointLight = {
  position: [50, 50, 100],
  color: [0.3, 0.6, 1],
};

let pro = mat4.create();
mat4.perspective(
  pro,
  (Math.PI / 180) * 65,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

let view = mat4.create();
mat4.lookAt(view, cameraPosition, [0, 0, 0], [0, 1, 0]);

console.log(pro, view);

function render() {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST);

  gl.useProgram(program);

  // 传输顶点数据
  gl.enableVertexAttribArray(entityWordF.locations.a_position);
  gl.bindBuffer(gl.ARRAY_BUFFER, entityWordF.buffers.position!);
  gl.vertexAttribPointer(
    entityWordF.locations.a_position,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.enableVertexAttribArray(entityWordF.locations.a_color);
  gl.bindBuffer(gl.ARRAY_BUFFER, entityWordF.buffers.color!);
  gl.vertexAttribPointer(
    entityWordF.locations.a_color,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.enableVertexAttribArray(entityWordF.locations.a_normal);
  gl.bindBuffer(gl.ARRAY_BUFFER, entityWordF.buffers.normal!);
  gl.vertexAttribPointer(
    entityWordF.locations.a_normal,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.uniformMatrix4fv(entityWordF.locations.u_projection, false, pro);
  gl.uniformMatrix4fv(entityWordF.locations.u_camera, false, view);

  gl.uniformMatrix4fv(entityWordF.locations.u_modelView, false, mat4.create());

  gl.uniform3fv(u_lightColor, new Float32Array(pointLight.color));
  gl.uniform3fv(u_lightPosition, new Float32Array(pointLight.position));

  gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
}

function animate(time: number) {
  requestAnimationFrame(animate);

  render();
}

requestAnimationFrame(animate);

// 添加gui 控制器

gui.add({ aspect: 65 }, 'aspect', 40, 90, 1).onChange((e: number) => {
  mat4.perspective(
    pro,
    (Math.PI / 180) * e,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
});

gui.add({ x: 45 }, 'x', 0, 180, 2).onChange((e: number) => {
  const rag = (Math.PI / 180) * e;

  const [x, y, z] = cameraPosition;
  const distance = Math.sqrt(y ** 2 + z ** 2);

  const _y = Math.sin(rag) * distance;
  const _z = Math.cos(rag) * distance;

  mat4.lookAt(view, [x, _y, _z], [0, 0, 0], [0, 1, 0]);
});

gui.add({ y: 45 }, 'y', 0, 180, 2).onChange((e: number) => {
  const rag = (Math.PI / 180) * e;

  const [x, y, z] = cameraPosition;
  const distance = Math.sqrt(x ** 2 + z ** 2);

  const _x = Math.cos(rag) * distance;
  const _z = Math.sin(rag) * distance;

  mat4.lookAt(view, [_x, y, _z], [0, 0, 0], [0, 1, 0]);
});

gui.add({ z: 45 }, 'z', 0, 90, 2).onChange((e) => {
  const rag = (Math.PI / 180) * e;

  const [x, y, z] = view.slice(12);

  const distance = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

  const _x = Math.sin(rag) * distance;
  const _Y = Math.cos(rag) * distance;

  console.log(_x, _Y, z);

  mat4.lookAt(view, [_x, _Y, z], [0, 0, 0], [0, 1, 0]);
});

gui.add({ lightX: 45 }, 'lightX', -90, 90, 10).onChange((e) => {
  pointLight.position[0] = e;
});
gui.add({ lightY: 45 }, 'lightY', -90, 90, 10).onChange((e) => {
  pointLight.position[1] = e;
});

gui.add({ lightZ: 45 }, 'lightZ', -90, 90, 10).onChange((e) => {
  pointLight.position[2] = e;
});
