import { Material, Options } from './Material';
import vs from './shader/normal/shader.vs.glsl?raw';
import fs from './shader/normal/shader.fs.glsl?raw';

export class NormalMaterial extends Material {
  constructor(options: Options) {
    super(vs, fs, 'NormalMaterial', options);
  }
}
