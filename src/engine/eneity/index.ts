import { Geometry } from './../geometry/geometry';
import { mat4, vec3 } from 'gl-matrix';
import { Material } from '../materials/Material';
import { TextureImage2D } from '../texture';
type Shaders = [string, string];

export class Object3D {
  public id: string;
  public modelView: mat4 = mat4.create();
  public position: vec3 = vec3.create();

  public xRotate: number = 0;
  public yRotate: number = 0;
  public zRotate: number = 0;

  public scaleSizeX: number = 1;
  public scaleSizeY: number = 1;
  public scaleSizeZ: number = 1;

  public name?: string;

  public userData: any = {};

  constructor(public geometry: Geometry, public material: Material) {
    this.id = Math.random().toString().substring(2);
    // const defaultOptions = {
    //   renderType: 0x4,
    //   count: 3,
    // };
    // this.options = { ...defaultOptions, ...options };
  }

  transform() {
    const translate = mat4.create();

    mat4.translate(translate, mat4.create(), this.position);

    const rotateXyz = mat4.create();
    mat4.rotateX(rotateXyz, mat4.create(), this.xRotate);
    mat4.rotateY(rotateXyz, rotateXyz, this.yRotate);
    mat4.rotateZ(rotateXyz, rotateXyz, this.zRotate);
    mat4.scale(rotateXyz, rotateXyz, [
      this.scaleSizeX,
      this.scaleSizeY,
      this.scaleSizeZ,
    ]);

    mat4.multiply(this.modelView, rotateXyz, translate);
  }

  setPosition(position: vec3) {
    this.position = position;
    this.transform();
  }

  rotateX(radius: number) {
    this.xRotate = (Math.PI / 180) * radius;
    this.transform();
  }
  rotateY(radius: number) {
    this.yRotate = (Math.PI / 180) * radius;
    this.transform();
  }
  rotateZ(radius: number) {
    this.zRotate = (Math.PI / 180) * radius;
    this.transform();
  }

  scaleX(size: number) {
    this.scaleSizeX = size;
    this.transform();
  }
  scaleY(size: number) {
    this.scaleSizeY = size;
    this.transform();
  }
  scaleZ(size: number) {
    this.scaleSizeZ = size;
    this.transform();
  }

  translation() {}
}

export class Entity extends Object3D {
  constructor(geometry: Geometry, material: Material) {
    super(geometry, material);
  }
}

export class LineEntity extends Object3D {
  constructor(geometry: Geometry, material: Material) {
    super(geometry, material);
  }
}
