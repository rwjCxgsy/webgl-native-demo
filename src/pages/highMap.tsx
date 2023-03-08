import { Entity, Object3D } from "../engine/eneity";
import { PlaneGeometry } from "../engine/geometry";
import { ShaderMaterial } from "../engine/materials";
import { getNormalByHighMap } from "../engine/utils/highMap";
import { TextureImage2D } from "../engine/texture";

import a_url from '/assets/texture/mountain/default_c.png';
import b_url from '/assets/texture/mountain/default_d.png';
import c_url from '/assets/texture/mountain/bigRockFace.png';
import d_url from '/assets/texture/mountain/grayRock.png';
import e_url from '/assets/texture/mountain/hardDirt.png';
import f_url from '/assets/texture/mountain/shortGrass.png';

import mountainVs from '../engine/materials/shader/mountain/shader.vs.glsl?raw';
import mountainFs from '../engine/materials/shader/mountain/shader.fs.glsl?raw';
import { useEffect, useRef } from "react";
import { Renderer } from "../engine/renderer";
import { Camera } from "../engine/renderer/camera";
import { AmbientLight, PointLight } from "../engine/light/light";


export default function HighMap () {

  
  const container = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
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
  camera.setPosition(0, 60, 150);

  // 添加灯光
  const baseLight = new AmbientLight([1, 1, 1]);
  const pointLight = new PointLight([1, 1, 1], [10, 80, 10]);

  const scene: Set<Object3D> = new Set();


  let mountain: Object3D;
    function load() {
      const image = new Image();
      image.onload = () => {
        const geometry = new PlaneGeometry(99, 99, 99, 99);
        const { normal, heightY } = getNormalByHighMap(image, 100, 100);
        geometry.attr.normal = new Float32Array(normal);
        heightY.forEach((val: number, index) => {
          // @ts-ignore
          geometry.attr.position[index * 3 + 1] = val;
        });
    
        mountain = new Entity(
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
    
        mountain.name = 'mountain';
    
        scene.add(mountain);
      };
      image.src = './assets/texture/mountain/default.png';
    }
    load();

    let ani: number = 0;

    function animate (time: number) {
      ani = window.requestAnimationFrame(animate)
      mountain?.rotateY(time / 100);
      renderer.render(camera, scene, [baseLight]);
    }
    ani = window.requestAnimationFrame(animate)
    return () => {
      window.cancelAnimationFrame(ani)
    }
  }, [])
  return <canvas ref={container}></canvas>
}