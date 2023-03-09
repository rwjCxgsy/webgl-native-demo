import { Object3D } from '../eneity/index';
import { vec3 } from 'gl-matrix';
import { Geometry } from './geometry';
import { createSphereVertices } from '../utils/geometry';
import { Ray } from '../tools/ray';

class SphereGeometry extends Geometry {
  constructor(
    public radius: number = 1,
    public subdivisionsAxis: number = 32,
    public subdivisionsHeight: number = 16,
    public opt_startLatitudeInRadians: number = 0,
    public opt_endLatitudeInRadians: number = Math.PI,
    public opt_startLongitudeInRadians: number = 0,
    public opt_endLongitudeInRadians: number = Math.PI * 2
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

  RayTrace(ray: Ray): boolean {
    return false;
  }
}

export { SphereGeometry };
