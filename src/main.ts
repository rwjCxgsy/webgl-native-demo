import {
  StandardMaterial,
  BasicMaterial,
  ShaderMaterial,
} from './engine/materials';

import { Entity } from './engine/eneity/index';

import './index.css';

import GUI from 'lil-gui';
import { Renderer } from './engine/renderer';
import { Object3D } from './engine/eneity';
import { AmbientLight, PointLight } from './engine/light/light';

import { TextureImage2D } from './engine/texture';

import { SphereGeometry } from './engine/geometry/sphere';
import { CubeGeometry, PlaneGeometry } from './engine/geometry';

import waterVs from './engine/materials/shader/water/shader.vs.glsl?raw';
import waterFs from './engine/materials/shader/water/shader.fs.glsl?raw';

import { Control } from './engine/control';
import { Camera } from './engine/renderer/camera';

import { SkyMaterial } from './engine/materials/skyMaterial';

import water_nrmUrl from './assets/texture/water_nrm.png';

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
      shadow: true,
      textures: [new TextureImage2D(water_nrmUrl)],
    })
  );

  scene.add(water);

  const light = new Entity(
    new SphereGeometry(2, 16, 8),
    new BasicMaterial({ color: 0xff0000 })
  );

  // scene.add(light);

  const control = new Control(canvas, camera);

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
