import { Material, Options } from './Material';
import vs from './shader/standard/shader.vs.glsl?raw';
import fs from './shader/standard/shader.fs.glsl?raw';

export class StandardMaterial extends Material {
  constructor(options: Options) {
    super(vs, fs, 'StandardMaterial', options);
  }
}
