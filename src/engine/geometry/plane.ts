import { mat4, vec3 } from 'gl-matrix';
import { Geometry } from './geometry';
import { createPlaneVertices } from '../utils/geometry';
import { Ray } from '../tools/ray';

class PlaneGeometry extends Geometry {
  constructor(
    width: number = 10,
    depth: number = 10,
    subdivisionsWidth: number = 1,
    subdivisionsDepth: number = 1,
    matrix: mat4 = mat4.create()
  ) {
    super(
      createPlaneVertices(
        width,
        depth,
        subdivisionsWidth,
        subdivisionsDepth,
        matrix
      )
    );
  }
  RayTrace(ray: Ray): boolean {
    return false;
  }
}

export { PlaneGeometry };
