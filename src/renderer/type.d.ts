export type ProgramInfo = {
  program: WebGLProgram;
  buffers: {
    [key: string]: WebGLBuffer;
  };
  textures: Set<WebGLTexture>;
  indicesBuffer?: WebGLBuffer;
};
