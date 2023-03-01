import { mat4, vec3 } from 'gl-matrix';

class Camera {
  public position: vec3 = vec3.create();

  public projectionMatrix: mat4 = mat4.create();

  shadowView: mat4 = mat4.create();

  public up: vec3 = [0, 1, 0];

  public target: vec3 = vec3.create();

  public viewMatrix: mat4 = mat4.create();

  constructor(
    fov: number,
    aspectRatio: number,
    nearPlane: number,
    farPlane: number
  ) {
    let pro = (this.projectionMatrix = mat4.create());
    mat4.perspective(
      pro,
      (Math.PI / 180) * fov,
      aspectRatio,
      nearPlane,
      farPlane
    );
  }

  // get viewMatrix() {
  //   let view = mat4.create();
  //   mat4.targetTo(view, this.position, this.target, this.up);
  //   return view;
  // }

  get viewMatrixInverse() {
    const m4 = mat4.create();
    mat4.invert(m4, this.viewMatrix);
    return m4;
  }

  lookAt(x: number, y: number, z: number) {
    this.target = [x, y, z];
    this.update();
  }

  setPosition(x: number, y: number, z: number) {
    this.position = [x, y, z];
    this.update();
  }

  eyeToTargetDistance() {
    return Math.sqrt(
      Math.pow(this.position[0] - this.target[0], 2) +
        Math.pow(this.position[1] - this.target[1], 2) +
        Math.pow(this.position[2] - this.target[2], 2)
    );
  }

  rotate(angle: number, axis: vec3) {
    mat4.rotate(this.viewMatrix, mat4.create(), (Math.PI / 180) * angle, axis);
  }

  multiply(m4: mat4) {
    mat4.multiply(this.viewMatrix, this.viewMatrix, m4);
  }

  update() {
    mat4.targetTo(this.viewMatrix, this.position, this.target, this.up);
  }
}

export { Camera };
