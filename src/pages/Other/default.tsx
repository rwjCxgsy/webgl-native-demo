import { useEffect, useRef } from "react"
import {start}from '../../main';

export default function Demo() {

  const canvasRef = useRef<HTMLCanvasElement>(null)


  useEffect(() => {
    const canvas = canvasRef.current!

    const {destroy} = start(canvas)
    return () => {
      destroy()
    }
  }, [])

  return <canvas ref={canvasRef}></canvas>
}