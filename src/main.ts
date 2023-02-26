import {
  StandardMaterial,
  BasicMaterial,
  NormalMaterial,
  ShaderMaterial,
} from './materials';

import { Entity } from './eneity/index';
import { Vector3 } from 'three';

import { mat4, vec3 } from 'gl-matrix';

import './index.css';

import GUI from 'lil-gui';
import { Renderer, Camera } from './render';
import { Object3D } from './eneity';
import { AmbientLight, PointLight } from './light/light';
import { AxisHelper } from './geometry/axis';
import { TextureImage2D } from './texture';

import { SphereGeometry } from './geometry/sphere';
import { CubeGeometry, PlaneGeometry } from './geometry';

import waterVs from './materials/shader/water/shader.vs.glsl?raw';
import waterFs from './materials/shader/water/shader.fs.glsl?raw';

import mountainVs from './materials/shader/mountain/shader.vs.glsl?raw';
import mountainFs from './materials/shader/mountain/shader.fs.glsl?raw';
import { caleNormalVector, getNormalByHighMap } from './utils/highMap';

(window as any).Vector3 = Vector3;

const gui = new GUI();

const canvas = document.querySelector('#root') as HTMLCanvasElement;

const renderer = new Renderer(canvas);

// 相机位置
let cameraPosition: vec3 = [40, 40, 80];

// 添加灯光
const baseLight = new AmbientLight([0.5, 0.5, 0.5]);
const pointLight = new PointLight([1, 1, 1], [0, 30, 200]);

const scene: Set<Object3D> = new Set();

// const sphere = new Entity(
//   new SphereGeometry(10, 128, 64),
//   new StandardMaterial({ color: 0xff6633 })
// );

// sphere.setPosition([10, 10, 0]);
// scene.add(sphere);

// const Cube = new Entity(
//   new CubeGeometry(10),
//   new StandardMaterial({ color: 0xffff00 })
// );

// Cube.setPosition([-10, 10, 0]);

// scene.add(Cube);

// const plane = new Entity(
//   new PlaneGeometry(120, 120),
//   new ShaderMaterial(waterVs, waterFs, {
//     color: 0x3366ff,
//     textures: [new TextureImage2D('/assets/texture/water_nrm.png')],
//   })
// );
// plane.name = '海水';

// scene.add(plane);

function loadHighMap() {
  const image = new Image();
  image.onload = () => {
    const geometry = new PlaneGeometry(50, 50);

    const { normal, heightY } = getNormalByHighMap(image, 50, 50);
    geometry.attr.normal = new Float32Array(normal);

    // heightY.forEach((val, index) => {
    //   geometry.attr.position[index * 3 + 1] = val;
    // });

    const mountain = new Entity(
      geometry,
      new ShaderMaterial(mountainVs, mountainFs, {
        color: 0xfff000,
        textures: [
          new TextureImage2D('/assets/texture/mountain/default_c.png'),
          new TextureImage2D('/assets/texture/mountain/default_d.png'),
          new TextureImage2D('/assets/texture/mountain/bigRockFace.png'),
          new TextureImage2D('/assets/texture/mountain/grayRock.png'),
          new TextureImage2D('/assets/texture/mountain/hardDirt.png'),
          new TextureImage2D('/assets/texture/mountain/shortGrass.png'),
        ],
      })
    );

    mountain.name = '山';

    // scene.add(mountain);
  };
  image.src = '/assets/texture/mountain/default.png';
}
loadHighMap();

const light = new Entity(
  new SphereGeometry(2, 16, 8),
  new BasicMaterial({ color: 0xff0000 })
);

scene.add(light);

const gl = renderer.gl;

const depthTexture = gl.createTexture()!;
const depthTextureSize = 512;
gl.bindTexture(gl.TEXTURE_2D, depthTexture);
gl.texImage2D(
  gl.TEXTURE_2D, // target
  0, // mip level
  gl.DEPTH_COMPONENT, // internal format
  depthTextureSize, // width
  depthTextureSize, // height
  0, // border
  gl.DEPTH_COMPONENT, // format
  gl.UNSIGNED_INT, // type
  null
); // data
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

const depthFramebuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
gl.framebufferTexture2D(
  gl.FRAMEBUFFER, // target
  gl.DEPTH_ATTACHMENT, // attachment point
  gl.TEXTURE_2D, // texture target
  depthTexture, // texture
  0
); // mip level

function animate(time: number) {
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  requestAnimationFrame(animate);

  const x = Math.sin((Math.PI / 180) * (time / 20)) * 50;
  const y = Math.cos((Math.PI / 180) * (time / 20)) * 50;

  pointLight.position![0] = x;
  pointLight.position![2] = y;

  light.setPosition(pointLight.position);

  // mat4.targetTo(shadowView, pointLight.position, [0, 0, 0], [0, 1, 0]);

  // mat4.scale(shadowView, shadowView, [100, 100, 100]);
  // mat4.invert(shadowView, shadowView);

  // _camera.shadowView = shadowView;

  // plane.material.time = time;

  // 基于相机位置创建视图矩阵
  const lightWorldMatrix = mat4.create();
  // 创建投影矩阵
  const lightProjectionMatrix = mat4.create();
  {
    // mat4.targetTo(
    //   lightWorldMatrix,
    //   pointLight.position, // position
    //   [0, 0, 0], // target
    //   [0, 1, 0] // up
    // );
    // mat4.perspective(
    //   lightProjectionMatrix,
    //   (Math.PI / 180) * 80,
    //   window.innerWidth / window.innerHeight,
    //   1,
    //   100
    // );
    // // draw to the depth texture
    // gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    // gl.viewport(0, 0, depthTextureSize, depthTextureSize);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // const _camera: Camera = {
    //   projection: lightProjectionMatrix,
    //   view: lightWorldMatrix,
    //   position: pointLight.position,
    //   shadowView: mat4.create(),
    // };
    // renderer.render(_camera, scene, [baseLight, pointLight]);
  }

  {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    let pro = mat4.create();
    mat4.perspective(
      pro,
      (Math.PI / 180) * 65,
      window.innerWidth / window.innerHeight,
      0.01,
      200
    );

    let view = mat4.create();
    mat4.targetTo(view, cameraPosition, [0, 0, 0], [0, 1, 0]);

    const shadowView = mat4.create();
    // mat4.targetTo(shadowView, pointLight.position, [0, 0, 0], [0, 1, 0]);
    // mat4.scale(shadowView, shadowView, [200, 200, 512]);
    // mat4.invert(shadowView, shadowView);
    {
      mat4.translate(shadowView, shadowView, [0.5, 0.5, 0.5]);
      mat4.scale(shadowView, shadowView, [0.5, 0.5, 0.5]);
      mat4.multiply(shadowView, shadowView, lightProjectionMatrix);
      // use the inverse of this world matrix to make
      // a matrix that will transform other positions
      // to be relative this world space.

      const _m = mat4.create();
      mat4.invert(_m, lightWorldMatrix);
      mat4.multiply(shadowView, shadowView, _m);
    }
    const _camera: Camera = {
      projection: pro,
      view: view,
      position: cameraPosition,
      shadowView,
      shadowTexture: depthTexture,
    };
    renderer.render(_camera, scene, [baseLight, pointLight]);
  }
}

requestAnimationFrame(animate);

// 添加gui 控制器

gui.add({ aspect: 65 }, 'aspect', 40, 90, 1).onChange((e: number) => {
  // mat4.perspective(
  //   pro,
  //   (Math.PI / 180) * e,
  //   window.innerWidth / window.innerHeight,
  //   0.01,
  //   1000
  // );
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

gui.add({ cameraY: 0 }, 'cameraY', -180, 180, 2).onChange((e) => {
  meshF.rotateZ(e);
});

gui.add({ lightX: 0 }, 'lightX', -300, 300, 2).onChange((e: number) => {
  pointLight.position![0] = e;
});

gui.add({ lightY: 0 }, 'lightY', -300, 300, 2).onChange((e: number) => {
  pointLight.position![1] = e;
});

gui.add({ lightZ: 0 }, 'lightZ', -300, 300, 2).onChange((e: number) => {
  pointLight.position![2] = e;
});
