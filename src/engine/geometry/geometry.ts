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

export class Geometry {
  public attr: Attributes;
  public indices?: ArrayBuffer;
  public indicesLength?: number;
  public vertexCount?: number;
  public boundingBox?: number[][];
  public drawType: number = 0x4;
  constructor(attributes: Attributes, options?: Options) {
    this.indices = attributes.indices;

    delete attributes.indices;
    this.attr = attributes;
    // @ts-ignore
    this.indicesLength = this.indices?.length;
    this.vertexCount = options?.vertexCount;
    this.boundingBox = options?.boundingBox;
    this.drawType = options?.drawType || 0x4;
  }
}
