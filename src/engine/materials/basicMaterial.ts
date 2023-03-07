import { Material, Options } from './Material';
import vs from './shader/basic/shader.vs.glsl?raw';
import fs from './shader/basic/shader.fs.glsl?raw';

export class BasicMaterial extends Material {
  constructor(options: Options) {
    super(vs, fs, 'BasicMaterial', options);
  }
}
