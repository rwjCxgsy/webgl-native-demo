import { Material } from './Material';
import vs from './shader/line/shader.vs.glsl?raw';
import fs from './shader/line/shader.fs.glsl?raw';

class LineMaterial extends Material {
  constructor() {
    super(vs, fs, 'LineMaterial');
  }
}

export { LineMaterial };
