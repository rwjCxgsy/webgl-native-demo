import lineVs from '../shader/a_color/shader.vs.glsl?raw';
import lineFs from '../shader/a_color/shader.fs.glsl?raw';
import { Object3D } from '../eneity';

function getAxis(size: number = 1) {
  return {
    position: new Float32Array([
      -size,
      0,
      0,
      size,
      0,
      0,

      0,
      -size,
      0,
      0,
      size,
      0,

      0,
      0,
      -size,
      0,
      0,
      size,
    ]),
    color: new Float32Array([
      1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1,
    ]),
  };
}

class AxisHelper extends Object3D {
  constructor(size: number = 100) {
    super(
      [lineVs, lineFs],
      {
        attributes: getAxis(size),
      },
      {
        renderType: 0x1,
      }
    );
  }
}

export { AxisHelper };
