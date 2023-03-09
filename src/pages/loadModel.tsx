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



const files = [
'./Models/Banner_01.mtl',
'./Models/Banner_01.obj',
'./Models/Castle_Wall_01.mtl',
'./Models/Castle_Wall_01.obj',
'./Models/Grey_Arch_01.mtl',
'./Models/Grey_Arch_01.obj',
'./Models/Grey_Border_Wall_01.mtl',
'./Models/Grey_Border_Wall_01.obj',
'./Models/Grey_Broken_Wall_01.mtl',
'./Models/Grey_Broken_Wall_01.obj',
'./Models/Grey_Corner_01.mtl',
'./Models/Grey_Corner_01.obj',
'./Models/Grey_Door_Round_01.mtl',
'./Models/Grey_Door_Round_01.obj',
'./Models/Grey_Door_Square_01.mtl',
'./Models/Grey_Door_Square_01.obj',
'./Models/Grey_Pole_01.mtl',
'./Models/Grey_Pole_01.obj',
'./Models/Grey_Short_Wall_01.mtl',
'./Models/Grey_Short_Wall_01.obj',
'./Models/Grey_Slanted_Pole_01.mtl',
'./Models/Grey_Slanted_Pole_01.obj',
'./Models/Grey_Slanted_Wall_01.mtl',
'./Models/Grey_Slanted_Wall_01.obj',
'./Models/Grey_Small_Wall_01.mtl',
'./Models/Grey_Small_Wall_01.obj',
'./Models/Grey_Triangle_01.mtl',
'./Models/Grey_Triangle_01.obj',
'./Models/Grey_Wall_01.mtl',
'./Models/Grey_Wall_01.obj',
'./Models/Grey_Window_Narrow_01.mtl',
'./Models/Grey_Window_Narrow_01.obj',
'./Models/Grey_Window_Round_01.mtl',
'./Models/Grey_Window_Round_01.obj',
'./Models/Grey_Window_Round_Long_01.mtl',
'./Models/Grey_Window_Round_Long_01.obj',
'./Models/Grey_Window_Round_Sill_01.mtl',
'./Models/Grey_Window_Round_Sill_01.obj',
'./Models/Grey_Window_Square_01.mtl',
'./Models/Grey_Window_Square_01.obj',
'./Models/Grey_Window_Square_Sill_01.mtl',
'./Models/Grey_Window_Square_Sill_01.obj',
'./Models/Iron_Door_01.mtl',
'./Models/Iron_Door_01.obj',
'./Models/Lightpost_01.mtl',
'./Models/Lightpost_01.obj',
'./Models/Plate_Corner_01.mtl',
'./Models/Plate_Corner_01.obj',
'./Models/Plate_Curve_01.mtl',
'./Models/Plate_Curve_01.obj',
'./Models/Plate_Pavement_01.mtl',
'./Models/Plate_Pavement_01.obj',
'./Models/Plate_Road_01.mtl',
'./Models/Plate_Road_01.obj',
'./Models/Plate_Sidewalk_01.mtl',
'./Models/Plate_Sidewalk_01.obj',
'./Models/Plate_Wood_01.mtl',
'./Models/Plate_Wood_01.obj',
'./Models/Roof_Corner_Green_01.mtl',
'./Models/Roof_Corner_Green_01.obj',
'./Models/Roof_Corner_Red_01.mtl',
'./Models/Roof_Corner_Red_01.obj',
'./Models/Roof_Inner_Corner_Green_01.mtl',
'./Models/Roof_Inner_Corner_Green_01.obj',
'./Models/Roof_Inner_Corner_Red_01.mtl',
'./Models/Roof_Inner_Corner_Red_01.obj',
'./Models/Roof_Point_Green_01.mtl',
'./Models/Roof_Point_Green_01.obj',
'./Models/Roof_Point_Red_01.mtl',
'./Models/Roof_Point_Red_01.obj',
'./Models/Roof_Slant_Green_01.mtl',
'./Models/Roof_Slant_Green_01.obj',
'./Models/Roof_Slant_Red_01.mtl',
'./Models/Roof_Slant_Red_01.obj',
'./Models/Roof_Straight_Green_01.mtl',
'./Models/Roof_Straight_Green_01.obj',
'./Models/Roof_Straight_Red_01.mtl',
'./Models/Roof_Straight_Red_01.obj',
'./Models/Shield_Green_01.mtl',
'./Models/Shield_Green_01.obj',
'./Models/Shield_Red_01.mtl',
'./Models/Shield_Red_01.obj',
'./Models/Stairs_Stone_01.mtl',
'./Models/Stairs_Stone_01.obj',
'./Models/Stairs_Wood_01.mtl',
'./Models/Stairs_Wood_01.obj',
'./Models/Tree_01.mtl',
'./Models/Tree_01.obj',
'./Models/Wood_Arch_01.mtl',
'./Models/Wood_Arch_01.obj',
'./Models/Wood_Border_Wall_01.mtl',
'./Models/Wood_Border_Wall_01.obj',
'./Models/Wood_Broken_Wall_01.mtl',
'./Models/Wood_Broken_Wall_01.obj',
'./Models/Wood_Corner_01.mtl',
'./Models/Wood_Corner_01.obj',
'./Models/Wood_Door_01.mtl',
'./Models/Wood_Door_01.obj',
'./Models/Wood_Door_Round_01.mtl',
'./Models/Wood_Door_Round_01.obj',
'./Models/Wood_Door_Square_01.mtl',
'./Models/Wood_Door_Square_01.obj',
'./Models/Wood_Pole_01.mtl',
'./Models/Wood_Pole_01.obj',
'./Models/Wood_Railing_01.mtl',
'./Models/Wood_Railing_01.obj',
'./Models/Wood_Slanted_Pole_01.mtl',
'./Models/Wood_Slanted_Pole_01.obj',
'./Models/Wood_Slanted_Wall_01.mtl',
'./Models/Wood_Slanted_Wall_01.obj',
'./Models/Wood_Small_Wall_01.mtl',
'./Models/Wood_Small_Wall_01.obj',
'./Models/Wood_Tiny_Wall_01.mtl',
'./Models/Wood_Tiny_Wall_01.obj',
'./Models/Wood_Triangle_01.mtl',
'./Models/Wood_Triangle_01.obj',
'./Models/Wood_Wall_01.mtl',
'./Models/Wood_Wall_01.obj',
'./Models/Wood_Wall_Cross_01.mtl',
'./Models/Wood_Wall_Cross_01.obj',
'./Models/Wood_Wall_Double_Cross_01.mtl',
'./Models/Wood_Wall_Double_Cross_01.obj',
'./Models/Wood_Window_Narrow_01.mtl',
'./Models/Wood_Window_Narrow_01.obj',
'./Models/Wood_Window_Round_01.mtl',
'./Models/Wood_Window_Round_01.obj',
'./Models/Wood_Window_Round_Long_01.mtl',
'./Models/Wood_Window_Round_Long_01.obj',
'./Models/Wood_Window_Round_Sill_01.mtl',
'./Models/Wood_Window_Round_Sill_01.obj',
'./Models/Wood_Window_Square_01.mtl',
'./Models/Wood_Window_Square_01.obj',
'./Models/Wood_Window_Square_Sill_01.mtl',
'./Models/Wood_Window_Square_Sill_01.obj'
]

export function LoadModel () {




      
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
  camera.setPosition(20, 20, 20);

  const control = new Control(canvas, camera)

  // 添加灯光
  const baseLight = new AmbientLight([1, 1, 1]);
  const pointLight = new PointLight([1, 1, 1], [10, 20, 10]);

  const scene: Set<Object3D> = new Set();

  let entity: Object3D;

    const fetch = async (url: string) => {
      const data = await load(url, OBJLoader, {});

      const material = await load('./roads.mtl', MTLLoader, {});
      const {attributes: {POSITION, NORMAL, TEXCOORD_0}, header} = data
      entity = new Entity(
        new CustomGeometry(POSITION.value, NORMAL.value, TEXCOORD_0.value, header), 
        new StandardMaterial({textures: [new TextureImage2D('./basetexture.jpg', true)]}))

      scene.add(entity)
    }

    fetch('./roads.obj')

    // files.filter(v => v.endsWith('obj')).forEach(url => {
    //   fetch(url);
    // })

    let ani: number = 0;

    function animate (time: number) {
      ani = window.requestAnimationFrame(animate)
      const x = Math.sin(time / 200) * 20;
      const z = Math.cos(time / 200) * 20
      pointLight.position = [x, pointLight.position[1] ,z]
      // entity?.rotateY(time / 200)
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