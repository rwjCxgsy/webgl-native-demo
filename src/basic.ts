import * as wordF from './geometry/f';
import { getBoxGeometry } from './geometry/box';
import fs from './shader/shader.fs.glsl?raw';
import vs from './shader/shader.vs.glsl?raw';
import boxVs from './shader/u_color/shader.vs.glsl?raw';
import boxFs from './shader/u_color/shader.fs.glsl?raw';

import lineVs from './shader/a_color/shader.vs.glsl?raw';
import lineFs from './shader/a_color/shader.fs.glsl?raw';

import { getAxis } from './geometry/axis';

import { mat4, vec3 } from 'gl-matrix';

import './index.css';

import GUI from 'lil-gui';
import { renderScene, Object3D, Camera, Light } from './render';

const gui = new GUI();

function createVec3(a: number, b: number, c: number) {
  const out = vec3.create();
  vec3.set(out, a, b, c);
  return out;
}

const canvas = document.querySelector('#root') as HTMLCanvasElement;
const gl = canvas.getContext('webgl', { antialias: true })!;

console.log(gl.TRIANGLES, gl.LINES);
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

// 相机位置
let cameraPosition: vec3 = [0, 0, 600];

vec3.create();

// 添加灯光
const baseLight = new Light([0.3, 0.3, 0.3], 'base');
let pointLight = new Light([1, 1, 1], 'point', [-5, -5, 200]);

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

const scene: Set<Object3D> = new Set();

const meshF = new Object3D([vs, fs], {
  attributes: {
    position: outPosition,
    color: wordF.colors,
    normals: wordF.normals,
  },
});

const MeshLight = new Object3D(
  [boxVs, boxFs],
  {
    attributes: {
      position: getBoxGeometry(5),
    },
    uniforms: {
      color: pointLight.color,
    },
  },
  gl.TRIANGLES
);

MeshLight.setPosition(pointLight.position);

const MeshAxis = new Object3D(
  [lineVs, lineFs],
  {
    attributes: getAxis(500),
  },
  gl.LINES
);

scene.add(meshF);
scene.add(MeshLight);
scene.add(MeshAxis);

const _camera: Camera = {
  projection: pro,
  view: view,
  position: cameraPosition,
};

function animate(time: number) {
  requestAnimationFrame(animate);

  const x = Math.sin((Math.PI / 180) * (time / 20)) * 150;
  const z = Math.cos((Math.PI / 180) * (time / 20)) * 150;

  pointLight.position![0] = x;
  pointLight.position![2] = z;

  MeshLight.setPosition(pointLight.position);

  renderScene(gl, _camera, scene, [baseLight, pointLight]);
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

gui.add({ x: 0 }, 'x', 0, 180, 2).onChange((e: number) => {
  meshF.rotateX(e);
});

gui.add({ y: 0 }, 'y', 0, 180, 2).onChange((e: number) => {
  meshF.rotateY(e);
});

gui.add({ z: 0 }, 'z', 0, 90, 2).onChange((e) => {
  meshF.rotateZ(e);
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
