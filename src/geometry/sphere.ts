import { vec3 } from 'gl-matrix';
function getSphere(
  radius = 1,
  widthSegments = 32,
  heightSegments = 16,
  phiLength = Math.PI * 2, // 经度
  thetaLength = Math.PI // 维度
) {
  widthSegments = Math.max(3, Math.floor(widthSegments));
  heightSegments = Math.max(2, Math.floor(heightSegments));

  const thetaEnd = Math.min(thetaLength, Math.PI);

  let index = 0;

  let vertex = vec3.create();
  let normal = vec3.create();

  // buffers

  let vertices: number[] = [];
  let normals: number[] = [];
  let uvs: number[] = [];

  // generate vertices, normals and uvs

  // 表示前一排的定点坐标
  let prevRowVertex = new Array(widthSegments)
    .fill(0)
    .map(() => [0, 1, 0])
    .flat(2);

  for (let iy = 1; iy <= heightSegments; iy++) {
    // 维度占比
    const v = iy / heightSegments;

    let currentRowVertex: number[] = [];

    let prevPoint = [0];
    for (let ix = 1; ix <= widthSegments; ix++) {
      // 经度
      const u = ix / widthSegments;

      // vertex

      const a = prevRowVertex.slice(ix * 3, ix * 3 + 3);

      console.log(a);

      const point = vec3.create();

      // 求当前纬度的半径 后乘
      point[0] = radius * Math.sin(v * thetaLength) * Math.cos(u * phiLength);
      point[1] = radius * Math.cos(v * thetaLength);
      point[2] = radius * Math.sin(u * phiLength) * Math.sin(v * thetaLength);

      vertices.push(vertex[0], vertex[1], vertex[2]);

      // normal

      // normal.copy( vertex ).normalize();
      normal = vec3.clone(vertex);
      vec3.normalize(normal, normal);
      normals.push(normal[0], normal[1], normal[2]);

      // uv

      // uvs.push(u + uOffset, 1 - v);

      // verticesRow.push(index++);
    }
    prevRowVertex = currentRowVertex;
  }
  return {
    position: new Float32Array(vertices),
    normal: new Float32Array(normals),
    uv: new Float32Array(uvs),
  };
}

export { getSphere };
