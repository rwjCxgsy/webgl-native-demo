import { Geometry, Options } from './geometry';

const position = [
  -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1,
  1, 1,
];
const indices = [
  0, 1, 1, 3, 3, 2, 2, 0,

  4, 5, 5, 7, 7, 6, 6, 4,

  0, 4, 1, 5, 3, 7, 2, 6,
];
const color = [
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
];
class CustomBoxGeometry extends Geometry {
  constructor() {
    const data = {
      position: new Float32Array(position),
      color: new Float32Array(color),
      indices: new Uint16Array(indices),
    };
    super(data);
  }
}

class CustomGeometry extends Geometry {
  constructor(
    position: Float32Array,
    normal: Float32Array,
    texcoord: Float32Array,
    options: Options
  ) {
    const data = {
      position,
      normal,
      texcoord,
    };
    super(data, options);
  }
}

class AxisGeometry extends Geometry {
  constructor(size: number = 100) {
    const data = {
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
        size,
        0,
        0,
        -size,
      ]),
      color: new Float32Array([
        1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1,
      ]),
    };
    super(data, { vertexCount: 6, drawType: 0x1 });
  }
}

export { CustomGeometry, CustomBoxGeometry, AxisGeometry };
