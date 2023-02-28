import { Geometry } from './geometry';

const position = [
  -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1,
  1, 1,
];
const indices = [
  0, 1, 1, 3, 3, 2, 2, 0,

  4, 5, 5, 7, 7, 6, 6, 4,

  0, 4, 1, 5, 3, 7, 2, 6,
];
class CustomGeometry extends Geometry {
  constructor() {
    const data = {
      position: new Float32Array(position),
      indices: new Uint16Array(indices),
    };
    super(data);
  }
}

export { CustomGeometry };
