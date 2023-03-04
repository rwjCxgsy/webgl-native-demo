import { useEffect, useRef } from "react"
import { Color, Matrix3 } from "three";
import { drawCell, drawLine, Line, Vec2 } from "./units";
import useAxis from "./useAxis";






export default  function Format() {



  const {ctxRef, ctxBaseProjection} = useAxis()

  const container = useRef<HTMLDivElement>(null)


  useEffect(() => {
    const destroy =  alert(`
      线性插值
      <p>1: 通过递增x (k大于0小于1)或者y(k大于1)计算, 通过一次方程计算后四舍五入取整，ps: 计算量大，需要加法运算再取整运算</p>
      <p>2: Bresenham算法，通过递增x (k大于0小于1)或者y(k大于1), 如对x递增，轴坐标可能是（x, y）或（x, y+1）,判断那两个点那个距离线段近即可</p>
    `)
        // @ts-ignore
    container.current?.append(ctxRef.current.canvas)
    const ctx = ctxRef.current!
    const canvas = ctxRef.current!.canvas as HTMLCanvasElement


  
    let lines = [
      new Line(new Vec2(-17, 2), new Vec2(10,7)),
      new Line(new Vec2(-15, -1), new Vec2(18,-20)),
      new Line(new Vec2(0, 1), new Vec2(10,-9)),
      new Line(new Vec2(0, 10), new Vec2(20,10)),
      new Line(new Vec2(-2, 9), new Vec2(-2,20)),
    ]

    function draw() {
      lines.forEach(line => {
        drawLine(ctx, line.p1, line.p2)
        const list = line.getPixel1()
        list.forEach((v) => {
          drawCell(ctx, v)
        })
      })
    }

    const handler = () => {
      draw()
    }

    window.addEventListener('update-render', handler)
    function clickHandler (e: MouseEvent) {
    }




    canvas.addEventListener('click', clickHandler)
    return () => {
      canvas.removeEventListener('click', clickHandler)
      window.removeEventListener('update-render', handler)
      // @ts-ignore
      destroy();
    }
  }, [])

  return <div ref={container}>
  </div>
}