import { Material, Options } from './Material';
import vs from './shader/sky/shader.vs.glsl?raw';
import fs from './shader/sky/shader.fs.glsl?raw';

class SkyMaterial extends Material {
  constructor(option: Options) {
    super(vs, fs, 'SkyMaterial', option);
  }
}

export { SkyMaterial };
