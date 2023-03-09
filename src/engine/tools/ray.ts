import { Object3D } from '../eneity/index';
import { vec3, mat4, vec2 } from 'gl-matrix';
import { Camera } from '../renderer/camera';
export class Ray {
  public emit: vec3 = vec3.create();
  public directive: vec3 = vec3.create();
  constructor() {}
  setCamera(point: vec2, camera: Camera) {
    this.emit = vec3.clone(camera.position);
    const point3 = vec3.create();
    point3[0] = point[0];
    point3[1] = point[1];
    point3[2] = 1;
    const p1 = vec3.create();
    {
      const m1 = mat4.create();
      mat4.invert(m1, camera.projectionMatrix);

      const m3 = mat4.create();
      mat4.multiply(m3, camera.viewMatrix, m1);

      vec3.transformMat4(p1, point3, m3);
    }

    this.directive = vec3.clone(p1);
  }

  inspection(list: Object3D[]): Object3D[] {
    const result: Object3D[] = [];

    const p = vec3.create();
    vec3.subtract(p, this.directive, this.emit);

    list.forEach((v) => {
      const p1 = vec3.create();

      const center = vec3.create();

      vec3.transformMat4(center, vec3.create(), v.modelView);

      vec3.subtract(p1, center, this.emit);

      const p1_n = vec3.create();
      vec3.normalize(p1_n, p1);

      const p_n = vec3.create();
      vec3.normalize(p_n, p);

      const d = Math.sqrt(1 - vec3.dot(p1_n, p_n) ** 2) * vec3.length(p1);

      if (d < v.geometry.radius!) {
        result.push(v);
      }
    });

    result.sort((a, b) => {
      let len1: number;
      {
        const a1 = vec3.create();
        vec3.transformMat4(a1, vec3.create(), a.modelView);
        const p = vec3.create();
        vec3.subtract(p, a1, this.emit);
        len1 = vec3.length(p);
      }
      let len2: number;
      {
        const a2 = vec3.create();
        vec3.transformMat4(a2, vec3.create(), b.modelView);
        const p = vec3.create();
        vec3.subtract(p, a2, this.emit);
        len2 = vec3.length(p);
      }
      return len1 - len2;
    });
    return result;
  }
}
