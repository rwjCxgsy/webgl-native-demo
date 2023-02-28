import { TextureImage2D } from '../texture';

export interface Options {
  color?: number;
  time?: number;
  textures?: TextureImage2D[];
}

export class Material {
  public u_bias: number = -0.0001;
  public color: number = 0xffffff;
  public textures: TextureImage2D[] = [];
  public time: number = 0;

  constructor(
    public vs: string,
    public fs: string,
    public type: string,
    option: Options = {}
  ) {
    Object.entries(option).forEach(([key, value]) => {
      // @ts-ignore
      this[key] = value;
    });
  }
}
