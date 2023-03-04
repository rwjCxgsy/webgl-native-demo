import {
  StandardMaterial,
  BasicMaterial,
  NormalMaterial,
  ShaderMaterial,
} from './materials';

import { Entity } from './eneity/index';
import { BoxGeometry, Vector3 } from 'three';

import { mat4, vec3 } from 'gl-matrix';

import './index.css';

import GUI from 'lil-gui';
import { Renderer } from './renderer';
import { Object3D } from './eneity';
import { AmbientLight, PointLight } from './light/light';

import { TextureImage2D } from './texture';

import { SphereGeometry } from './geometry/sphere';
import { CubeGeometry, PlaneGeometry } from './geometry';

import waterVs from './materials/shader/water/shader.vs.glsl?raw';
import waterFs from './materials/shader/water/shader.fs.glsl?raw';

import mountainVs from './materials/shader/mountain/shader.vs.glsl?raw';
import mountainFs from './materials/shader/mountain/shader.fs.glsl?raw';
import { caleNormalVector, getNormalByHighMap } from './utils/highMap';
import { Control } from './control';
import { Camera } from './renderer/camera';
import { CustomGeometry } from './geometry/customGeometry';
import { LineMaterial } from './materials/LineMaterial';
import { createShaderProgram } from './program';
import { SkyMaterial } from './materials/skyMaterial';

import water_nrmUrl from './assets/texture/water_nrm.png';

import a_url from '/assets/texture/mountain/default_c.png';
import b_url from '/assets/texture/mountain/default_d.png';
import c_url from '/assets/texture/mountain/bigRockFace.png';
import d_url from '/assets/texture/mountain/grayRock.png';
import e_url from '/assets/texture/mountain/hardDirt.png';
import f_url from '/assets/texture/mountain/shortGrass.png';
// import girl from './assets/racer_anime_girl.glb';

// import { load } from '@loaders.gl/core';
// import { GLBLoader } from '@loaders.gl/gltf';

// const data = await load('racer_anime_girl.glb', GLBLoader);

// console.log(data);

// const chunk = data.binChunks[0].arrayBuffer.slice(27096);

// const { byteLength, byteOffset } = data.json.bufferViews[3];
// const imageData = chunk.slice(byteOffset, byteOffset + byteLength);

// var blob = new Blob([imageData], { type: 'image/png' });
// var imageUrl = (window.URL || window.webkitURL).createObjectURL(blob);
// const image = new Image();
// image.src = imageUrl;

// document.body.append(image);

function start(canvas: HTMLCanvasElement) {
  const gui = new GUI();
  let run: number;

  const { width, height } = document
    .querySelector('#detail')!
    .getBoundingClientRect();
  const renderer = new Renderer(canvas, { width, height });

  const camera = new Camera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.lookAt(0, 0, 0);
  camera.setPosition(0, 60, 150);

  // 添加灯光
  const baseLight = new AmbientLight([1, 1, 1]);
  const pointLight = new PointLight([1, 1, 1], [10, 80, 10]);

  const scene: Set<Object3D> = new Set();

  const entityList: Set<Object3D> = new Set();

  {
    for (let i = 0; i < 50; i++) {
      const entity = new Entity(
        new SphereGeometry(((Math.random() * 5) | 0) + 3, 32, 16),
        new StandardMaterial({
          color: (Math.random() * 0xffffff) | 0,
        })
      );
      const x = Math.random() * 100 - 55;
      const y = Math.random() * 50 + 10;
      const z = Math.random() * 100 - 50;
      entity.setPosition([x, y, z]);
      scene.add(entity);
      entityList.add(entity);
    }
    for (let i = 0; i < 50; i++) {
      const entity = new Entity(
        new CubeGeometry(((Math.random() * 5) | 0) + 3),
        new StandardMaterial({
          color: (Math.random() * 0xffffff) | 0,
        })
      );
      const x = Math.random() * 100 - 55;
      const y = Math.random() * 50 + 10;
      const z = Math.random() * 100 - 50;
      entity.setPosition([x, y, z]);
      scene.add(entity);
      entityList.add(entity);
    }
  }

  // 天空穹
  const sky = new Entity(
    new SphereGeometry(400, 64, 32, 0, Math.PI / 2, 0, Math.PI * 2),
    new SkyMaterial({
      color: 0x3366ff,
    })
  );

  sky.name = 'sky';
  scene.add(sky);

  const water = new Entity(
    new PlaneGeometry(1000, 1000),
    new ShaderMaterial(waterVs, waterFs, {
      color: 0x3366ff,
      textures: [new TextureImage2D(water_nrmUrl)],
    })
  );

  scene.add(water);

  function loadHighMap() {
    const image = new Image();
    image.onload = () => {
      const geometry = new PlaneGeometry(99, 99, 99, 99);
      const { normal, heightY } = getNormalByHighMap(image, 100, 100);
      geometry.attr.normal = new Float32Array(normal);
      heightY.forEach((val: number, index) => {
        // @ts-ignore
        geometry.attr.position[index * 3 + 1] = val;
      });

      const mountain = new Entity(
        geometry,
        new ShaderMaterial(mountainVs, mountainFs, {
          color: 0xfff000,
          textures: [
            new TextureImage2D(a_url),
            new TextureImage2D(b_url),
            new TextureImage2D(c_url),
            new TextureImage2D(d_url),
            new TextureImage2D(e_url),
            new TextureImage2D(f_url),
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

  // scene.add(light);

  const control = new Control(canvas, camera);

  const gl = renderer.gl;

  function animate(time: number) {
    run = requestAnimationFrame(animate);

    const x = Math.sin((Math.PI / 180) * (time / 20)) * 30;
    const z = Math.cos((Math.PI / 180) * (time / 20)) * 30;

    sky.setPosition([camera.position[0], 0, camera.position[2] * 2]);

    pointLight.position[0] = x;
    pointLight.position[2] = z;

    water.material.time = time;

    entityList.forEach((entity) => {
      entity.xRotate += 0.01;
      entity.yRotate += 0.02;
      entity.zRotate += 0.03;
    });

    renderer.renderShadowTexture(scene, [baseLight, pointLight]);
    renderer.render(camera, scene, [baseLight, pointLight]);
    renderer.renderFrustum(camera);
  }

  run = requestAnimationFrame(animate);

  // 添加gui 控制器

  gui.add({ aspect: 65 }, 'aspect', 40, 90, 1).onChange((e: number) => {});

  gui
    .add({ lightX: pointLight.position[0] }, 'lightX', -300, 300, 2)
    .onChange((e: number) => {
      pointLight.position![0] = e;
    });

  gui
    .add({ lightY: pointLight.position[1] }, 'lightY', 20, 300, 2)
    .onChange((e: number) => {
      pointLight.position![1] = e;
    });

  gui
    .add({ lightZ: pointLight.position[2] }, 'lightZ', -300, 300, 2)
    .onChange((e: number) => {
      pointLight.position![2] = e;
    });

  gui.add({ cameraX: 0 }, 'cameraX', 0, 90, 2).onChange((e: number) => {
    // pointLight.position![0] = e;
  });
  return {
    destroy() {
      gui.destroy();
      cancelAnimationFrame(run);
      control.destroy();
    },
  };
}

export { start };
