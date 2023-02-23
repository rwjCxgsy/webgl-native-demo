function getAxis(size: number = 1) {
  return {
    position: new Float32Array([
      0,
      0,
      0,
      size,
      0,
      0,

      0,
      0,
      0,
      0,
      size,
      0,

      0,
      0,
      0,
      0,
      0,
      size,
    ]),
    color: new Float32Array([
      1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1,
    ]),
  };
}

export { getAxis };
