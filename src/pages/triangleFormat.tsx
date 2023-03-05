import { useEffect, useRef } from 'react';
import { Color, Matrix3, Vector2, Vector3 } from 'three';
import { drawCell, drawLine, drawPoint, Triangle, Vec2 } from './units';
import useAxis from './useAxis';

export default function Matrix() {
  const { ctxRef, ctxBaseProjection } = useAxis();

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const destroy = alert(
      `
      点击屏幕坐标，自由切换三角形
      <p>1: 计算三个顶点的boundBox</p>
      <p>2: 对boundBox里的每个像素进行遍历，判断是否在三角形内（可以通过向量叉乘）</p>
      <p>3: 再通过重心坐标线性插值</p>
      `
    )
        // @ts-ignore
    container.current?.append(ctxRef.current.canvas);
    const ctx = ctxRef.current!;
    const canvas = ctxRef.current!.canvas as HTMLCanvasElement;




    const path: Array<Vec2> = [
      new Vec2(-5, 0),
      new Vec2(5, 4),
      new Vec2(6, -8)
    ].map(v => {
      v.extraColor = new Color('#' + Math.random().toString(16).substring(2, 8));
      return v
    });
    let min = new Vec2(0, 0);
    let max = new Vec2(0, 0);

    function computedAndDrawEdge() {
      if (!path.length) {
        return;
      }
      min.x = path[0].x;
      min.y = path[0].y;
      max.x = path[0].x;
      max.y = path[0].y;

      for (let i = 1; i < path.length; i++) {
        min.x = Math.min(min.x, path[i].x);
        min.y = Math.min(min.y, path[i].y);
        max.x = Math.max(max.x, path[i].x);
        max.y = Math.max(max.y, path[i].y);
      }

      drawLine(ctx, min, new Vec2(max.x, min.y), false, '#666666');
      drawLine(ctx, new Vec2(max.x, min.y), max, false, '#666666');
      drawLine(ctx, max, new Vec2(min.x, max.y), false, '#666666');
      drawLine(ctx, new Vec2(min.x, max.y), min, false, '#666666');
    }

    function draw() {
      if (path.length === 3) {
        // 绘制边界
        computedAndDrawEdge();
        //
        const triangle = new Triangle(path);
        let row = 0;
        let col = 0;
        for (let i = Math.floor(min.y); i <= Math.ceil(max.y); i++) {
          row++;
          col = 0;
          for (let j = Math.floor(min.x); j <= Math.ceil(max.x); j++) {
            col++;
            const p = new Vec2(j, i);
            const { bool, color } = triangle.inspection(p);
            p.extraColor = color
            if (bool) {
              drawCell(ctx, p);
            }
          }
        }
      }

      path.forEach((p) => {
        drawPoint(ctx, p);
      });
      for (let i = 1; i < path.length; i++) {
        drawLine(ctx, path[i - 1], path[i]);
        if (path.length == 3) {
          // 绘制三角形
          drawLine(ctx, path[2], path[0]);
        }
      }
    }

    const handler = () => {
      draw();
    };

    window.addEventListener('update-render', handler);

    function clickHandler(e: MouseEvent) {
      const { offsetX, offsetY } = e;
      if (path.length === 3) {
        path.length = 0;
      }
      const m4t = new Matrix3();
      m4t.translate(0.5, 0.5);
      const ve2 = new Vec2(offsetX, offsetY);
      ve2.applyMatrix3(
        ctxBaseProjection.current.clone().multiply(m4t).invert()
      );
      ve2.extraColor = new Color(
        path.length === 0
          ? '#ff0000'
          : path.length === 1
          ? '#00ff00'
          : '#0000ff'
      );
      path.push(ve2);
    }

    canvas.addEventListener('click', clickHandler);
    return () => {
      canvas.removeEventListener('click', clickHandler);
      window.removeEventListener('update-render', handler);
          // @ts-ignore
      destroy()
    };
  }, []);

  return <div ref={container}></div>;
}
