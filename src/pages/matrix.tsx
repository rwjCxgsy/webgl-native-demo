
import GUI from 'lil-gui'
import { memo, useEffect, useRef } from 'react'
import { Matrix3 } from 'three'
import { drawAxis } from './units'
import useAxis from './useAxis'
function Matrix() {
  const {ctxRef, ctxBaseProjection} = useAxis()

  const container = useRef<HTMLDivElement>(null)
  


  useEffect(() => {


    // @ts-ignore
    container.current?.append(ctxRef.current.canvas)

    const ctx = ctxRef.current!



    const projection = new Matrix3();

    const handler = () => {



      drawAxis(ctx, projection, '#3366ff', 0.03)
    }

    window.addEventListener('update-render', handler)

    
    const gui = new GUI();
    const options = {
      a: 1,
      c: 0,
      tx: 0,
      b: 0,
      d: 1,
      ty: 0,
      rotation: 0,
    };
    gui.add(options, 'a', -10, 10, 1).onChange((e: number) => {
      const val = projection.transpose().toArray();
      val[0] = e;
      projection.set(...val);
    });
    gui.add(options, 'b', -10, 10, 1).onChange((e: number) => {
      const val = projection.transpose().toArray();
      val[3] = e;
      projection.set(...val);
    });
    gui.add(options, 'c', -10, 10, 1).onChange((e: number) => {
      const val = projection.transpose().toArray();
      val[1] = e;
      projection.set(...val);
    });
    gui.add(options, 'd', -10, 10, 1).onChange((e: number) => {
      const val = projection.transpose().toArray();
      val[4] = e;
      projection.set(...val);
    });
    gui.add(options, 'tx', -10, 10, 1).onChange((e: number) => {
      const val = projection.transpose().toArray();
      val[2] = e;
      projection.set(...val);
    });
    gui.add(options, 'ty', -10, 10, 1).onChange((e: number) => {
      const val = projection.transpose().toArray();
      val[5] = e;
      projection.set(...val);
    });

    gui
      .add(options, 'rotation', -180, 180, 5)
      .name('旋转')
      .onChange((e: number) => {
        const val = projection.transpose().toArray();

        const c = Math.cos((Math.PI / 180) * e);
        const s = Math.sin((Math.PI / 180) * e);

        options.a = val[0] = c;
        val[1] = -s;
        val[3] = s;
        val[4] = c;
        projection.set(...val);
      });

      return () => {
        gui.destroy()
        window.removeEventListener('update-render', handler)
      }
  }, [ctxRef])

  return <div ref={container}>
  </div>
}

export default Matrix