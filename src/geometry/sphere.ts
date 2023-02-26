import { vec3 } from 'gl-matrix';
import { Geometry } from './geometry';
import { createSphereVertices } from '../utils/geometry';

class SphereGeometry extends Geometry {
  constructor(
    radius: number = 1,
    subdivisionsAxis: number = 32,
    subdivisionsHeight: number = 16,
    opt_startLatitudeInRadians: number = 0,
    opt_endLatitudeInRadians: number = Math.PI,
    opt_startLongitudeInRadians: number = 0,
    opt_endLongitudeInRadians: number = Math.PI * 2
  ) {
    super(
      createSphereVertices(
        radius,
        subdivisionsAxis,
        subdivisionsHeight,
        opt_startLatitudeInRadians,
        opt_endLatitudeInRadians,
        opt_startLongitudeInRadians,
        opt_endLongitudeInRadians
      )
    );
  }
}

export { SphereGeometry };
