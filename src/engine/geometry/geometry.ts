import { Ray } from '../tools/ray';

interface Attributes {
  position: ArrayBuffer;
  normal?: ArrayBuffer;
  texcoord?: ArrayBuffer;
  indices?: ArrayBuffer;
  color?: ArrayBuffer;
}

export interface Options {
  vertexCount: number;
  boundingBox?: number[][];
  drawType?: number;
}

export abstract class Geometry {
  public attr: Attributes;
  public indices?: ArrayBuffer;
  public indicesLength?: number;
  public vertexCount: number;
  public boundingBox?: number[][];
  public drawType: number = 0x4;
  constructor(attributes: Attributes, options?: Options) {
    this.indices = attributes.indices;

    this.attr = attributes;
    // @ts-ignore
    this.vertexCount = this.indices
      ? // @ts-ignore
        options?.vertexCount || this.indices?.length
      : // @ts-ignore
        attributes.position.length / 3;
    this.boundingBox = options?.boundingBox;
    this.drawType = options?.drawType || 0x4;

    delete attributes.indices;
  }

  abstract RayTrace(ray: Ray): boolean;
}
