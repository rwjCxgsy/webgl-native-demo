import { vec3 } from 'gl-matrix';
class Light {
  constructor(public type: string, public color: vec3, public position: vec3) {}
}

class AmbientLight extends Light {
  constructor(color: vec3, position: vec3 = [0, 0, 0]) {
    super('AmbientLight', color, position);
  }
}

class DirectionalLight extends Light {
  constructor(color: vec3, position: vec3) {
    super('DirectionalLight', color, position);
  }
}

class PointLight extends Light {
  constructor(color: vec3, position: vec3) {
    super('PointLight', color, position);
  }
}

export { Light, AmbientLight, PointLight, DirectionalLight };
