import { useEffect, useRef } from 'react';
import { Color, Matrix3, Vector2, Vector3 } from 'three';
import { drawCell, drawCircle, drawLine, drawPoint, drawText, lineCross, Polygon, polygonIsTu, Triangle, Vec2 } from './units';
import useAxis from './useAxis';

export default function Grid() {
  const { ctxRef, ctxBaseProjection } = useAxis();

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const destroy = alert(
      `
      多边形三角化算法
      <p>1: 从多边形i, i+1, i+2 的顶点构成的三角形，判断该三角形是否，在三角形内部，并且该三角形没有包含其他顶点，若是则剔除该三角形</p>
      <p>2: 剔除三角形后，连接i，i+2</p>
      <p>3: 依次判断，若否，则将起始顶点+1</p>
      <p>4: 按上述步骤到只剩一个三角形时候终止</p>
      `
    )
        // @ts-ignore
    container.current?.append(ctxRef.current.canvas);
    const ctx = ctxRef.current!;
    const canvas = ctxRef.current!.canvas as HTMLCanvasElement;


    const center = new Vec2(0, 0)
    const radius = 15;


    const originData: Vec2[] = [
      new Vec2(-12, 0),
      new Vec2(-8, 12),
      new Vec2(10, 20),
      new Vec2(5, 10),
      new Vec2(15, 5),
      new Vec2(20, -10),
      new Vec2(10, 0),
      new Vec2(20, -15),
      new Vec2(5, -1),
      new Vec2(-5, -10),
    ]

    const polygon =  new Polygon(originData)


    const render = () => {
      // drawCircle(ctx, center, radius)
      // getPixel()
      const data = [...originData, originData[0]]
      for (let i = 1; i <= data.length; i++) {
        const s = data[i - 1]
        const e = data[i];
        drawLine(ctx, s, e)
      }

      const path: Vec2[] = [
        ...originData
      ];
      let j = 0;
      let number = 1
      while (path.length > 3) {
        let j1 = j + 1;
        let j2 = j + 2;
        j %= path.length;
        j1 %= path.length;
        j2 %= path.length;
        if (path[j] && path[j1] && path[j2]) {
          const triangle = new Triangle([path[j],path[j1], path[j2]])
          const wight = triangle.getWightPoint()
          let include = false;
          {
            const temp = [...originData, originData[0]];
            for (let i = 1; i < temp.length; i++) {
              const s = temp[i - 1];
              const e = temp[i];
              include = lineCross(s, e, path[j], path[j2]);
              if (include) {
                break;
              }
            }
          }
          const _polygon =  new Polygon(path)
          if(triangle.isValid() && _polygon.inspection(wight) && !include) {
            // 表示是一个耳朵
            // 剔除该三角
            drawLine(ctx, path[j], path[j2], false, '#aaaaaa')
            drawText(ctx, wight, `${number++}`)
            path.splice(j1, 1)
          } else {
            j++
          }
        }
      }
      if (path.length === 3) {
        const triangle = new Triangle([path[0],path[1], path[2]])
        const wight = triangle.getWightPoint()
        drawText(ctx, wight, `${number++}`)
      }
    };

    window.addEventListener('update-render', render);

    function clickHandler(e: MouseEvent) {
    }

    canvas.addEventListener('click', clickHandler);
    return () => {
      canvas.removeEventListener('click', clickHandler);
      window.removeEventListener('update-render', render);
      //@ts-ignore
      destroy()
    };
  }, []);

  return <div ref={container}></div>;
}
