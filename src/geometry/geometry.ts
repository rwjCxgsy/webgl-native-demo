interface Attributes {
  position: ArrayBuffer;
  normal?: ArrayBuffer;
  texcoord?: ArrayBuffer;
  indices?: ArrayBuffer;
}

export class Geometry {
  public attr: Attributes;
  public indices?: ArrayBuffer;
  public indicesLength?: number;
  constructor(attributes: Attributes) {
    this.indices = attributes.indices || new Int8Array();

    delete attributes.indices;
    this.attr = attributes;

    this.indicesLength = this.indices.length;
  }
}
