import { OBJLoader, MTLLoader } from '@loaders.gl/obj';
import { load } from '@loaders.gl/core';
import { useEffect, useRef } from 'react';
import { Renderer } from '../../engine/renderer';
import { Camera } from '../../engine/renderer/camera';
import { AmbientLight, PointLight } from '../../engine/light/light';
import { Entity, Object3D } from '../../engine/eneity';

import {
  AxisGeometry,
  CircleGeometry,
  CustomGeometry,
  CustomPlaneGeometry,
} from '../../engine/geometry/customGeometry';
import { BasicMaterial, StandardMaterial } from '../../engine/materials';
import { TextureImage2D } from '../../engine/texture';
import { PlaneGeometry, SphereGeometry } from '../../engine/geometry';
import { Control } from '../../engine/control';

import { BoxGeometry } from 'three';
import { LineMaterial } from '../../engine/materials/LineMaterial';
import GUI from 'lil-gui';

export default function Axis() {
  const container = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const options = {
      radius: 10,
      a: 30,
      b: 20,
    };
    const canvas = container.current!;
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
    camera.setPosition(30, 30, 30);

    const control = new Control(canvas, camera);

    // 添加灯光
    const baseLight = new AmbientLight([1, 1, 1]);
    const pointLight = new PointLight([1, 1, 1], [10, 20, 10]);

    const scene: Set<Object3D> = new Set();

    const axis = new Entity(new AxisGeometry(50), new LineMaterial());

    scene.add(axis);

    let point: Object3D = new Entity(
      new SphereGeometry(),
      new StandardMaterial({ color: 0xffffff })
    );


    point.setPosition([0,options.radius,0])

    scene.add(point);

    const entityX = new Entity(new CircleGeometry(), new LineMaterial());
    entityX.scaleX(0)
    entityX.scaleZ(0)
    entityX.scaleY(options.radius)
    scene.add(entityX)

    const entityY = new Entity(new CustomPlaneGeometry(), new LineMaterial());

    entityY.scaleX(0);
    entityY.scaleY(options.radius * 2)
    scene.add(entityY)

    let ani: number = 0;

    toPosition();

    function animate(time: number) {
      ani = window.requestAnimationFrame(animate);
      const x = Math.sin(time / 200) * 20;
      const z = Math.cos(time / 200) * 20;
      pointLight.position = [x, pointLight.position[1], z];
      renderer.render(camera, scene, [baseLight, pointLight]);
    }
    ani = window.requestAnimationFrame(animate);

    function toPosition() {
      const a = options.a / 180 * Math.PI
      const b = options.b / 180 * Math.PI
      const x = options.radius * Math.sin(a) * Math.cos(b)
      const y = options.radius * Math.sin(a) * Math.sin(b);
      const z = options.radius * Math.cos(a)
      point.setPosition([x, z, y]);
      entityX.scaleX(Math.sin(a) * options.radius)
      entityX.scaleZ(Math.sin(a) * options.radius)
      entityX.scaleY(z)


      entityY.scaleX(Math.sin(a) * options.radius);
      entityY.scaleY(options.radius * 2)
      entityY.rotateY(-options.b)
    }

    const gui = new GUI();

    gui
      .add(options, 'radius', 1, 20, 1)
      .name('半径')
      .onChange((e: number) => {
        toPosition()
      });

    gui
      .add(options, 'a', 0, 180, 1)
      .name('极角')
      .onChange((e: number) => {
        toPosition()
      });

    gui
      .add(options, 'b', 0, 360, 10)
      .name('方位角')
      .onChange((e: number) => {
        toPosition()
      });
    return () => {
      window.cancelAnimationFrame(ani);
      control.destroy();
    };
  }, []);
  return <canvas ref={container}></canvas>;
}
