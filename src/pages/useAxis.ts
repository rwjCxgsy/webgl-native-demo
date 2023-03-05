import { Vector2 } from 'three';
import { mat3 } from 'gl-matrix';
import GUI from 'lil-gui';
import { useCallback, useEffect, useRef } from 'react';
import { Matrix3 } from 'three';
import { drawAxis } from './units';

export default function Test() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animate = useRef<number>();
  const ctxRef = useRef<CanvasRenderingContext2D>(null);

  const ctxBaseProjection = useRef<Matrix3>(new Matrix3());

  const base = new Matrix3();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const { width, height } = document
      .querySelector('#detail')!
      .getBoundingClientRect();
    const ctx = canvas.getContext('2d')!;

    const event = new CustomEvent('update-render');

    // @ts-ignore
    ctxRef.current = ctx;
    const WIDTH = (canvas.width = width * window.devicePixelRatio);
    const HEIGHT = (canvas.height = height * window.devicePixelRatio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    let X1 = 20;
    let Y1 = 0;
    let T1 = WIDTH / 2;
    let X2 = 0;
    let Y2 = -20;
    let T2 = HEIGHT / 2;

    base.set(X1, Y1, T1, X2, Y2, T2, 0, 0, 1);
    // base.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctxBaseProjection.current.copy(base);

    const projection = new Matrix3();

    function draw(time: number) {
      animate.current = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, width * 2, height * 2);
      ctx.save();
      drawAxis(ctx, base, '#eeeeee', 0.03);

      window.dispatchEvent(event);

      ctx.restore();
    }

    animate.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animate.current!);
    };
  }, []);
  return {
    canvasRef,
    ctxRef,
    ctxBaseProjection,
  };
}
