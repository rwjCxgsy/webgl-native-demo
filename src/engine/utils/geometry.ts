import { mat4 } from 'gl-matrix';
import { createAugmentedTypedArray } from './index.js';

const CUBE_FACE_INDICES = [
  [3, 7, 5, 1], // right
  [6, 2, 0, 4], // left
  [6, 7, 3, 2], // ??
  [0, 1, 5, 4], // ??
  [7, 6, 4, 5], // front
  [2, 3, 1, 0], // back
];

function createSphereVertices(
  radius: number = 10,
  subdivisionsAxis: number,
  subdivisionsHeight: number,
  opt_startLatitudeInRadians: number,
  opt_endLatitudeInRadians: number,
  opt_startLongitudeInRadians: number,
  opt_endLongitudeInRadians: number
) {
  if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
    throw Error('subdivisionAxis and subdivisionHeight must be > 0');
  }

  opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
  opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
  opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
  opt_endLongitudeInRadians = opt_endLongitudeInRadians || Math.PI * 2;

  const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
  const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

  // We are going to generate our sphere by iterating through its
  // spherical coordinates and generating 2 triangles for each quad on a
  // ring of the sphere.
  const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texCoords = createAugmentedTypedArray(2, numVertices);

  // Generate the individual vertices in our vertex buffer.
  for (let y = 0; y <= subdivisionsHeight; y++) {
    for (let x = 0; x <= subdivisionsAxis; x++) {
      // Generate a vertex based on its spherical coordinates
      const u = x / subdivisionsAxis;
      const v = y / subdivisionsHeight;
      const theta = longRange * u + opt_startLongitudeInRadians;
      const phi = latRange * v + opt_startLatitudeInRadians;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const ux = cosTheta * sinPhi;
      const uy = cosPhi;
      const uz = sinTheta * sinPhi;
      // @ts-ignore
      positions.push(radius * ux, radius * uy, radius * uz);
      // @ts-ignore
      normals.push(ux, uy, uz);
      // @ts-ignore
      texCoords.push(1 - u, v);
    }
  }

  const numVertsAround = subdivisionsAxis + 1;
  const indices = createAugmentedTypedArray(
    3,
    subdivisionsAxis * subdivisionsHeight * 2,
    Uint16Array
  );
  for (let x = 0; x < subdivisionsAxis; x++) {
    for (let y = 0; y < subdivisionsHeight; y++) {
      // @ts-ignore
      indices.push(
        (y + 0) * numVertsAround + x,
        (y + 0) * numVertsAround + x + 1,
        (y + 1) * numVertsAround + x
      );
      // @ts-ignore
      indices.push(
        (y + 1) * numVertsAround + x,
        (y + 0) * numVertsAround + x + 1,
        (y + 1) * numVertsAround + x + 1
      );
    }
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texCoords,
    indices: indices,
  };
}

function createCubeVertices(size: number = 10) {
  const k = size / 2;

  const cornerVertices = [
    [-k, -k, -k],
    [+k, -k, -k],
    [-k, +k, -k],
    [+k, +k, -k],
    [-k, -k, +k],
    [+k, -k, +k],
    [-k, +k, +k],
    [+k, +k, +k],
  ];

  const faceNormals = [
    [+1, +0, +0],
    [-1, +0, +0],
    [+0, +1, +0],
    [+0, -1, +0],
    [+0, +0, +1],
    [+0, +0, -1],
  ];

  const uvCoords = [
    [1, 0],
    [0, 0],
    [0, 1],
    [1, 1],
  ];

  const numVertices = 6 * 4;
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texCoords = createAugmentedTypedArray(2, numVertices);
  const indices = createAugmentedTypedArray(3, 6 * 2, Uint16Array);

  for (let f = 0; f < 6; ++f) {
    const faceIndices = CUBE_FACE_INDICES[f];
    for (let v = 0; v < 4; ++v) {
      const position = cornerVertices[faceIndices[v]];
      const normal = faceNormals[f];
      const uv = uvCoords[v];

      // Each face needs all four vertices because the normals and texture
      // coordinates are not all the same.
      // @ts-ignore
      positions.push(position);
      // @ts-ignore
      normals.push(normal);
      // @ts-ignore
      texCoords.push(uv);
    }
    // Two triangles make a square face.
    const offset = 4 * f;
    // @ts-ignore
    indices.push(offset + 0, offset + 1, offset + 2);
    // @ts-ignore
    indices.push(offset + 0, offset + 2, offset + 3);
  }

  return {
    position: positions,
    normal: normals,
    texcoord: texCoords,
    indices: indices,
  };
}

/**
 * Creates XZ plane vertices.
 * The created plane has position, normal and uv streams.
 *
 * @param {number} [width] Width of the plane. Default = 1
 * @param {number} [depth] Depth of the plane. Default = 1
 * @param {number} [subdivisionsWidth] Number of steps across the plane. Default = 1
 * @param {number} [subdivisionsDepth] Number of steps down the plane. Default = 1
 * @param {Matrix4} [matrix] A matrix by which to multiply all the vertices.
 * @return {Object.<string, TypedArray>} The
 *         created plane vertices.
 * @memberOf module:primitives
 */
function createPlaneVertices(
  width: number = 10,
  depth: number = 10,
  subdivisionsWidth: number = 1,
  subdivisionsDepth: number = 1,
  matrix: mat4 = mat4.create()
) {
  const numVertices = (subdivisionsWidth + 1) * (subdivisionsDepth + 1);
  const positions = createAugmentedTypedArray(3, numVertices);
  const normals = createAugmentedTypedArray(3, numVertices);
  const texcoords = createAugmentedTypedArray(2, numVertices);

  for (let z = 0; z <= subdivisionsDepth; z++) {
    for (let x = 0; x <= subdivisionsWidth; x++) {
      const u = x / subdivisionsWidth;
      const v = z / subdivisionsDepth;
      // @ts-ignore
      positions.push(width * u - width * 0.5, 0, depth * v - depth * 0.5);
      // @ts-ignore
      normals.push(0, 1, 0);
      // @ts-ignore
      texcoords.push(u, v);
    }
  }

  const numVertsAcross = subdivisionsWidth + 1;
  const indices = createAugmentedTypedArray(
    3,
    subdivisionsWidth * subdivisionsDepth * 2,
    Uint16Array
  );

  for (let z = 0; z < subdivisionsDepth; z++) {
    for (let x = 0; x < subdivisionsWidth; x++) {
      // Make triangle 1 of quad.
      // @ts-ignore
      indices.push(
        (z + 0) * numVertsAcross + x,
        (z + 1) * numVertsAcross + x,
        (z + 0) * numVertsAcross + x + 1
      );

      // Make triangle 2 of quad.
      // @ts-ignore
      indices.push(
        (z + 1) * numVertsAcross + x,
        (z + 1) * numVertsAcross + x + 1,
        (z + 0) * numVertsAcross + x + 1
      );
    }
  }

  // const arrays = reorientVertices(
  //   {
  //     position: positions,
  //     normal: normals,
  //     texcoord: texcoords,
  //     indices: indices,
  //   },
  //   matrix
  // );
  return {
    position: positions,
    normal: normals,
    texcoord: texcoords,
    indices: indices,
  };
}

export { createSphereVertices, createCubeVertices, createPlaneVertices };
