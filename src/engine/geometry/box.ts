import { mat4, vec3 } from 'gl-matrix';
import { Geometry } from './geometry';
import { createCubeVertices } from '../utils/geometry';
import { Ray } from '../tools/ray';

class CubeGeometry extends Geometry {
  constructor(size: number = 10) {
    super(createCubeVertices(size));
  }

  RayTrace(ray: Ray): boolean {
    return false;
  }
}

export { CubeGeometry };
