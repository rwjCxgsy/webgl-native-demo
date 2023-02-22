const data = [-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5];

export function createPlane(x: number = 1, y: number = 1): Float32Array {
  const data = [
    -0.5 * x,
    0.5 * y,
    -0.5 * x,
    -0.5 * y,
    0.5 * x,
    0.5 * y,
    -0.5 * x,
    -0.5 * y,
    0.5 * x,
    -0.5 * y,
    0.5 * x,
    0.5 * y,
  ];
  return new Float32Array(data);
}
