export type ProgramInfo = {
  program: WebGLProgram;
  buffers: {
    [key: string]: WebGLBuffer;
  };
  textures: Array<WebGLTexture>;
  indicesBuffer?: WebGLBuffer;
};

export interface Camera {
  projection: mat4;
  view: mat4;
  position: vec3;
  shadowProjection?: mat4;
  shadowView?: mat4;
  shadowTexture?: WebGLTexture;
}
