class TextureImage2D {
  loaded = false;
  image?: HTMLImageElement;
  texture?: WebGLTexture;
  constructor(public url: string, public level: number = 0x33984) {}
  load(gl: WebGLRenderingContext) {
    const texture = gl.createTexture()!;
    // gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = this.url;
    image.onload = () => {
      // gl.activeTexture(this.level);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      gl.generateMipmap(gl.TEXTURE_2D);
    };
    this.texture = texture;
    return texture;
  }
}

export { TextureImage2D };
