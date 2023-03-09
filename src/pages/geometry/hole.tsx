import { useEffect, useRef } from 'react';
import { Color, Matrix3, Vector2, Vector3 } from 'three';
import {
  drawCell,
  drawCircle,
  drawLine,
  drawPoint,
  drawText,
  lineCross,
  Polygon,
  polygonIsTu,
  Triangle,
  Vec2,
} from '../units';
import useAxis from '../useAxis';

export default function Hold() {
  const { ctxRef, ctxBaseProjection } = useAxis();

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const destroy = alert(
      `
        挖洞
        <p>从多边形内部挖取多边形</p>
        <p>1: 连接距离外轮廓一点的一个内部点,将组成一个复杂的多边形，然后再使用三角化算法</p>
      `
    );
    // @ts-ignore
    container.current?.append(ctxRef.current.canvas);
    const ctx = ctxRef.current!;
    const canvas = ctxRef.current!.canvas as HTMLCanvasElement;

    const warp = [
      new Vec2(-20, -20),
      new Vec2(20, -20),
      new Vec2(20, 20),
      new Vec2(-20, 20),
    ];

    const originData: Vec2[] = [
      new Vec2(-12, 0),
      new Vec2(-8, 12),
      new Vec2(10, 15),
      new Vec2(5, 10),
      new Vec2(10, 5),
      new Vec2(15, -10),
      new Vec2(10, 0),
      new Vec2(15, -15),
      new Vec2(5, -1),
      new Vec2(-5, -10),
    ];

    const render = () => {
      
        let p = originData[0];
        for (let i = 1; i < originData.length; i++) {
          const ele = originData[i];
          p = p.distanceTo(warp[0]) < warp[0].distanceTo(ele) ? p : ele;
        }
        const index = originData.indexOf(p);

        const list = [warp[0]];

        const prev = originData.slice(0, index + 1);
        const next = originData.slice(index + 1);

        function toReverse(list: Vec2[]) {
          return list.map((v) => v.clone()).reverse();
        }

        list.push(...toReverse(prev));
        list.push(...toReverse(next));
        list.push([...prev].pop()!);
        list.push(warp[0]);
        list.push(...[...warp].reverse());

        const path: Vec2[] = [...list];

        let j = 0;
        let number = 1;
        while (path.length > 3) {
          let j1 = j + 1;
          let j2 = j + 2;
          j %= path.length;
          j1 %= path.length;
          j2 %= path.length;
          if (path[j] && path[j1] && path[j2]) {
            const trianglePath = [path[j], path[j1], path[j2]];
            const triangle = new Triangle(trianglePath);
            const wight = triangle.getWightPoint();
            let include = false;
            {
              const temp = [...list, list[0]];
              for (let i = 1; i < temp.length; i++) {
                const s = temp[i - 1];
                const e = temp[i];
                include = lineCross(s, e, path[j], path[j2]);
                if (include) {
                  break;
                }
              }
            }
            const polygon = new Polygon(path);
            const inside = polygon.inspection(wight);
            if (triangle.isValid() && inside && !include) {



              // 表示是一个耳朵
              // 剔除该三角
              drawLine(ctx, path[j], path[j2], true, '#aaaaaa');
              drawLine(ctx, path[j], path[j1], true, '#aaaaaa');
              drawLine(ctx, path[j2], path[j1], true, '#aaaaaa');
              drawText(ctx, wight, `${number++}`);
              path.splice(j1, 1);
            } else {
              j++;
            }
          }
        }
        // if (path.length === 3) {
        //   const triangle = new Triangle([path[0], path[1], path[2]]);
        //   const wight = triangle.getWightPoint();
        //   drawText(ctx, wight, `${number++}`);
        // }
      {
        const data = [...originData, originData[0]]
        for (let i = 1; i <= data.length; i++) {
          const s = data[i - 1]
          const e = data[i];
          drawLine(ctx, s, e)
        }
      }

      {
        const data = [...warp, warp[0]]
        for (let i = 1; i <= data.length; i++) {
          const s = data[i - 1]
          const e = data[i];
          drawLine(ctx, s, e)
        }
      }

      {
        const data = [...originData, originData[0]]
        for (let i = 1; i <= data.length; i++) {
          const s = data[i - 1]
          const e = data[i];
          drawLine(ctx, s, e)
        }
      }

      {
        const data = [...warp, warp[0]]
        for (let i = 1; i <= data.length; i++) {
          const s = data[i - 1]
          const e = data[i];
          drawLine(ctx, s, e)
        }
      }
    };

    window.addEventListener('update-render', render);

    function clickHandler(e: MouseEvent) {}

    canvas.addEventListener('click', clickHandler);
    return () => {
      canvas.removeEventListener('click', clickHandler);
      window.removeEventListener('update-render', render);
      //@ts-ignore
      destroy();
    };
  }, []);

  return <div ref={container}></div>;
}
