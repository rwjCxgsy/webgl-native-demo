import { Material, Options } from './Material';

export class ShaderMaterial extends Material {
  constructor(vs: string, fs: string, option: Options) {
    super(vs, fs, 'ShaderMaterial', option);
  }
}
