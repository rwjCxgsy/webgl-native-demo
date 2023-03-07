interface Attributes {
  position: ArrayBuffer;
  normal?: ArrayBuffer;
  texcoord?: ArrayBuffer;
  indices?: ArrayBuffer;
}

export interface Options {
  vertexCount: number;
  boundingBox: number[][];
}

export class Geometry {
  public attr: Attributes;
  public indices?: ArrayBuffer;
  public indicesLength?: number;
  public vertexCount?: number;
  public boundingBox?: number[][];
  constructor(attributes: Attributes, options?: Options) {
    this.indices = attributes.indices;

    delete attributes.indices;
    this.attr = attributes;
    // @ts-ignore
    this.indicesLength = this.indices?.length;
    this.vertexCount = options?.vertexCount;
    this.boundingBox = options?.boundingBox;
  }
}
