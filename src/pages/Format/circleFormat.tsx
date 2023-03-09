import { useEffect, useRef } from 'react';
import { Color, Matrix3, Vector2, Vector3 } from 'three';
import { drawCell, drawCircle, drawLine, drawPoint, Triangle, Vec2 } from '../units';
import useAxis from '../useAxis';

export default function Circle() {
  const { ctxRef, ctxBaseProjection } = useAxis();

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {

    // const destroy = alert(
    //   `
    //   点击屏幕坐标，自由切换三角形
    //   <p>1: 计算三个顶点的boundBox</p>
    //   <p>2: 对boundBox里的每个像素进行遍历，判断是否在三角形内（可以通过向量叉乘）</p>
    //   <p>3: 再通过重心坐标线性插值</p>
    //   `
    // )
        // @ts-ignore
    container.current?.append(ctxRef.current.canvas);
    const ctx = ctxRef.current!;
    const canvas = ctxRef.current!.canvas as HTMLCanvasElement;


    const center = new Vec2(0, 0)
    const radius = 15;


    const path: Vec2[] = [];


    function getPixel() {

      const length = Math.ceil(Math.cos(Math.PI / 4) * radius)

      for (let i = length; i >= 0; i--) {
        const y = Math.sqrt(radius ** 2 - i ** 2)
      }
    }


    const render = () => {
      drawCircle(ctx, center, radius)
      getPixel()
    };

    window.addEventListener('update-render', render);

    function clickHandler(e: MouseEvent) {
    }

    canvas.addEventListener('click', clickHandler);
    return () => {
      canvas.removeEventListener('click', clickHandler);
      window.removeEventListener('update-render', render);

    };
  }, []);

  return <div ref={container}></div>;
}
