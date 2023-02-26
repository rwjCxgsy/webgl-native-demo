import { Material, Options } from './Material';

export class ShaderMaterial extends Material {
  constructor(vs: string, fs: string, options: Options) {
    super(vs, fs, 'ShaderMaterial', options);
  }
}
