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

function createDepthFrame(
  gl: WebGLRenderingContext,
  size: number
): { depthTexture: WebGLTexture; depthFramebuffer: WebGLFramebuffer } {
  const depthTexture = gl.createTexture()!;
  const depthTextureSize = size;
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.texImage2D(
    gl.TEXTURE_2D, // target
    0, // mip level
    gl.DEPTH_COMPONENT, // internal format
    depthTextureSize, // width
    depthTextureSize, // height
    0, // border
    gl.DEPTH_COMPONENT, // format
    gl.UNSIGNED_INT, // type
    null
  ); // data
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const depthFramebuffer = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, // target
    gl.DEPTH_ATTACHMENT, // attachment point
    gl.TEXTURE_2D, // texture target
    depthTexture, // texture
    0
  ); // mip level

  // create a color texture of the same size as the depth texture
  // see article why this is needed_
  const unusedTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, unusedTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    depthTextureSize,
    depthTextureSize,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // attach it to the framebuffer
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, // target
    gl.COLOR_ATTACHMENT0, // attachment point
    gl.TEXTURE_2D, // texture target
    unusedTexture, // texture
    0
  ); // mip level

  return {
    depthTexture,
    depthFramebuffer,
  };
}

function createSceneTexture(gl: WebGLRenderingContext, size: number = 512) {
  // Create a texture to render to

  const targetTexture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, targetTexture);

  {
    // define size and format of level 0
    const level = 0;
    const internalFormat = gl.RGBA;
    const border = 0;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;
    const data = null;
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      size,
      size,
      border,
      format,
      type,
      data
    );

    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  // Create and bind the framebuffer
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  // attach the texture as the first color attachment
  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  const level = 0;
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    attachmentPoint,
    gl.TEXTURE_2D,
    targetTexture,
    level
  );
  return {
    fb,
    targetTexture,
  };
}

function createPixelsTexture(gl: WebGLRenderingContext) {
  var texture = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texture);

  {
    // fill texture with 3x2 pixels
    const level = 0;
    const internalFormat = gl.LUMINANCE;
    const width = 3;
    const height = 2;
    const border = 0;
    const format = gl.LUMINANCE;
    const type = gl.UNSIGNED_BYTE;
    const data = new Uint8Array([128, 64, 128, 0, 192, 0]);
    const alignment = 1;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      format,
      type,
      data
    );

    // set the filtering so we don't need mips and it's not filtered
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  return texture;
}

export {
  TextureImage2D,
  createDepthFrame,
  createSceneTexture as createScene,
  createPixelsTexture,
};
