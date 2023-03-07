import { Material, Options } from './Material';
import vs from './shader/test/shader.vs.glsl?raw';
import fs from './shader/test/shader.fs.glsl?raw';

export class TestMaterial extends Material {
  constructor(options: Options) {
    super(vs, fs, 'TestMaterial', options);
  }
}
