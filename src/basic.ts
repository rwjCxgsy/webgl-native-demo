import { mat4 } from 'gl-matrix';
import { PerspectiveCamera, Matrix4, Vector3 } from 'three';
import { createShaderProgram } from './program';
import './index.css';

import GUI from 'lil-gui';

const gui = new GUI();

type vec3 = [number, number, number];
var ___mt4 = {
  perspectiveCamera: function (
    fov: number,
    aspect: number,
    near: number,
    far: number
  ) {
    var f = Math.tan(0.5 * fov);

    var base = -1.0 / (far - near);
    return new Float32Array([
      1 / (aspect * f),
      0,
      0,
      0,
      0,
      1 / f,
      0,
      0,
      0,
      0,
      (far + near) * base,
      -1,
      0,
      0,
      2 * far * near * base,
      0,
    ]);
  },

  subtractVec3(a: vec3, b: vec3): vec3 {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  },
  normalize(a: vec3): vec3 {
    var l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    return [a[0] / l, a[1] / l, a[2] / l];
  },

  cross(a: vec3, b: vec3): vec3 {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  },

  lookAt: function (position: vec3, eye: vec3, up: vec3) {
    const AxisZ = ___mt4.normalize(___mt4.subtractVec3(position, eye));
    const AxisX = ___mt4.normalize(___mt4.cross(up, AxisZ));
    const AxisY = ___mt4.cross(AxisZ, AxisX);

    const distanceX = (position[0] - eye[0]) ** 2;
    const distanceY = (position[1] - eye[1]) ** 2;
    const distanceZ = (position[2] - eye[2]) ** 2;
    return new Float32Array([
      AxisX[0],
      AxisY[0],
      AxisZ[0],
      0,
      AxisX[1],
      AxisY[1],
      AxisZ[1],
      0,
      AxisX[2],
      AxisY[2],
      AxisZ[2],
      0,
      -0,
      -0,
      -Math.sqrt(distanceX + distanceY + distanceZ),
      1,
    ]);
  },
  create: function () {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  },

  multiplyVec3(a: Float32Array, b: vec3): vec3 {
    return [
      a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * 1,
      a[4] * b[0] + a[5] * b[1] + a[6] * b[2] + a[7] * 1,
      a[8] * b[0] + a[9] * b[1] + a[10] * b[2] + a[11] * 1,
    ];
  },
};

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
  attribute vec2 a_position;
  uniform mat4 u_matrix;
  uniform mat4 u_projection;
  void main() {
    gl_Position = u_projection * u_matrix *  vec4(a_position, 1.0, 1.0);
  }
`;

const fs = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

const geometry = new Float32Array([-10, 0, 10, 0, 10, 50]);
const program = createShaderProgram(gl, vs, fs);

const a_position = gl.getAttribLocation(program, 'a_position');
const u_projection = gl.getUniformLocation(program, 'u_projection');
const u_matrix = gl.getUniformLocation(program, 'u_matrix');

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);

let pro = ___mt4.perspectiveCamera(
  (Math.PI / 180) * 65,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
let view = ___mt4.lookAt([10, 10, 50], [0, 0, 0], [0, 1, 0]);

// {
//   const camera = new PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.01,
//     1000
//   );
//   camera.up.set(0, 1, 0);
//   camera.lookAt(0, 0, 0);
//   camera.position.set(10, 10, 10);
//   camera.updateMatrixWorld();

//   const v1 = new Vector3(2, 2, 2);
//   // v1.applyMatrix4(camera.matrixWorld);

//   console.log(camera, v1);
// }

function render() {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(1.0, 1.0, 0.5, 1.0);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.enableVertexAttribArray(a_position);
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  gl.uniformMatrix4fv(u_projection, false, pro);

  gl.uniformMatrix4fv(u_matrix, false, view);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}

function animate(time: number) {
  requestAnimationFrame(animate);

  render();
}

requestAnimationFrame(animate);

gui.add({ aspect: 65 }, 'aspect', 40, 90, 1).onChange((e) => {
  pro = ___mt4.perspectiveCamera(
    (Math.PI / 180) * e,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
});

gui.add({ x: 50 }, 'x', -50, 50, 2).onChange((e) => {
  const z = Math.cos(Math.asin(e / 50)) * 50;

  console.log(e, z);
  view = ___mt4.lookAt([e, 0, z], [0, 0, 0], [0, 1, 0]);

  // const mat_test = new Matrix4();
  // mat_test.set(...view.slice());

  // mat_test.transpose();

  // mat_test.invert();

  // mat_test.transpose();

  // console.log(mat_test, view);

  // view = new Float32Array(mat_test.elements);

  // const out = mat4.create();

  // mat4.invert(out, view);

  // view = out;

  // console.log(view);
});
