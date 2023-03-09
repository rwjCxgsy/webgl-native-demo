
import { useEffect, useRef } from 'react';
import { Renderer } from '../../engine/renderer';
import { Camera } from '../../engine/renderer/camera';
import { AmbientLight, PointLight } from '../../engine/light/light';
import { Entity, Object3D } from '../../engine/eneity';

import { CustomGeometry } from "../../engine/geometry/customGeometry";
import { StandardMaterial } from '../../engine/materials';
import { CubeGeometry, SphereGeometry } from '../../engine/geometry';
import { Control } from '../../engine/control';

import { Ray } from '../../engine/tools/ray';
import { vec2 } from 'gl-matrix';




export default function RayPick () {

      
  const container = useRef<HTMLCanvasElement>(null)
  useEffect(() => {

    const pointer = vec2.create();

    const canvas = container.current!;
    const { width, height } = document
    .querySelector('#detail')!
    .getBoundingClientRect();
  const renderer = new Renderer(canvas, { width, height });



  const camera = new Camera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.lookAt(0, 0, 0);
  camera.setPosition(0, 30, 70);

  const control = new Control(canvas, camera)

  // 添加灯光
  const baseLight = new AmbientLight([1, 1, 1]);
  const pointLight = new PointLight([1, 1, 1], [10, 20, 10]);

  const scene: Set<Object3D> = new Set();

  const entityList = new Set<Object3D>();
  {
    for (let i = 0; i < 50; i++) {
      const entity = new Entity(
        new SphereGeometry(((Math.random() * 4) | 0), 32, 16),
        new StandardMaterial({
          color: (Math.random() * 0xffffff) | 0,
        })
      );
      entity.userData.color = entity.material.color;
      const x = Math.random() * 20 - 10;
      const y = Math.random() * 20 - 10;
      const z = Math.random() * 20 - 10;
      entity.setPosition([x, y, z]);
      scene.add(entity);
      entityList.add(entity);
    }
    // for (let i = 0; i < 50; i++) {
    //   const entity = new Entity(
    //     new CubeGeometry(((Math.random() * 4) | 0)),
    //     new StandardMaterial({
    //       color: (Math.random() * 0xffffff) | 0,
    //     })
    //   );
    //   const x = Math.random() * 20  - 10;
    //   const y = Math.random() * 20  - 10;
    //   const z = Math.random() * 20  - 10;
    //   entity.setPosition([x, y, z]);
    //   scene.add(entity);
    //   entityList.add(entity);
    // }
  }



    let ani: number = 0;
    const ray = new Ray()
    function animate (time: number) {
      // setTimeout(animate, 1000);
      ani = window.requestAnimationFrame(animate)
      const x = Math.sin(time / 200) * 20;
      const z = Math.cos(time / 200) * 20
      pointLight.position = [x, pointLight.position[1] ,z]
      renderer.render(camera, scene, [baseLight, pointLight]);

      ray.setCamera(pointer, camera)

      const d = ray.inspection([...entityList])
      entityList.forEach(v => {
        v.material.color = v.userData.color
      })
      if (d[0]) {
        d[0].material.color = 0x0000ff
      }
    }
    ani = window.requestAnimationFrame(animate)
    // setTimeout(animate, 1000);

    const handlerMove = (event: MouseEvent) => {
      pointer[0] = ( event.offsetX / width ) * 2 - 1;
      pointer[1] = - ( event.offsetY / height ) * 2 + 1;
    }

    canvas.addEventListener('mousemove', handlerMove)
    return () => {
      window.cancelAnimationFrame(ani)
      //@ts-ignore
      control.destroy()
      canvas.removeEventListener('mousemove', handlerMove)
    }
  }, [])
  return <canvas ref={container}></canvas>
}