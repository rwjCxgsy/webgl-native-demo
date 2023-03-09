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

//@ts-ignore
class CustomBoxGeometry extends Geometry {
  constructor() {
    const data = {
      position: new Float32Array(position),
      color: new Float32Array(color),
      indices: new Uint16Array(indices),
    };
    super(data, { drawType: 0x1, vertexCount: 12 * 2 });
  }
}
//@ts-ignore
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
//@ts-ignore
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
//@ts-ignore
class CircleGeometry extends Geometry {
  constructor(size: number = 100) {
    const position = [0, 0, 0];
    const color = [1, 0, 0];

    for (let i = 0; i <= 64; i++) {
      const x = Math.cos(((Math.PI * 2) / 64) * i) * 1;
      const z = Math.sin(((Math.PI * 2) / 64) * i) * 1;
      position.push(x, 1, z);
      color.push(1, 0, 0);
    }

    const data = {
      position: new Float32Array(position),
      color: new Float32Array(color),
    };
    super(data, { vertexCount: 65, drawType: 0x6 });
  }
}
//@ts-ignore
class CustomPlaneGeometry extends Geometry {
  constructor() {
    const position = [0, -1, 0, 1, -1, 0, 0, 1, 0, 0, 1, 0, 1, -1, 0, 1, 1, 0];
    const color = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

    const data = {
      position: new Float32Array(position),
      color: new Float32Array(color),
      // indices: new Float32Array([0, 1, 3, 3, 1, 2]),
    };
    super(data, { vertexCount: 6 });
  }
}

export {
  CustomGeometry,
  CustomBoxGeometry,
  AxisGeometry,
  CircleGeometry,
  CustomPlaneGeometry,
};
