import { Material } from './Material';
import vs from './shader/shadow/shader.vs.glsl?raw';
import fs from './shader/shadow/shader.fs.glsl?raw';

class ShadowMaterial extends Material {
  constructor() {
    super(vs, fs, 'ShadowMaterial');
  }
}

export { ShadowMaterial };
