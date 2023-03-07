import { mat4, vec3 } from 'gl-matrix';
import { Geometry } from './geometry';
import { createCubeVertices } from '../utils/geometry';

class CubeGeometry extends Geometry {
  constructor(size: number = 10) {
    super(createCubeVertices(size));
  }
}

export { CubeGeometry };
