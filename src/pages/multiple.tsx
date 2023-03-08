import {OBJLoader, MTLLoader} from '@loaders.gl/obj';
import {load} from '@loaders.gl/core';
import { useEffect, useRef } from 'react';
import { Renderer } from '../engine/renderer';
import { Camera } from '../engine/renderer/camera';
import { AmbientLight, PointLight } from '../engine/light/light';
import { Entity, Object3D } from '../engine/eneity';

import { CustomGeometry } from "../engine/geometry/customGeometry";
import { StandardMaterial } from '../engine/materials';
import { TextureImage2D } from '../engine/texture';
import { SphereGeometry } from '../engine/geometry';
import { Control } from '../engine/control';

import { BoxGeometry } from "three";




export default function MultipleView () {

      
  const container = useRef<HTMLCanvasElement>(null)
  useEffect(() => {

    console.log(new BoxGeometry(10, 10, 10))
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

  const control = new Control(canvas, camera)

  // 添加灯光
  const baseLight = new AmbientLight([1, 1, 1]);
  const pointLight = new PointLight([1, 1, 1], [10, 20, 10]);

  const scene: Set<Object3D> = new Set();

  let entity: Object3D;

    // files.filter(v => v.endsWith('obj')).forEach(url => {
    //   fetch(url);
    // })

    let ani: number = 0;

    function animate (time: number) {
      ani = window.requestAnimationFrame(animate)
      const x = Math.sin(time / 200) * 20;
      const z = Math.cos(time / 200) * 20
      pointLight.position = [x, pointLight.position[1] ,z]
      entity?.rotateY(time / 200)
      renderer.render(camera, scene, [baseLight, pointLight]);
    }
    ani = window.requestAnimationFrame(animate)
    return () => {
      window.cancelAnimationFrame(ani)
      control.destroy()
    }
  }, [])
  return <canvas ref={container}></canvas>
}