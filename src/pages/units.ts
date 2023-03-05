import { Color, Vector2, Line3, Matrix3, Vector3 } from 'three';

//@ts-ignore
import segseg from 'segseg';
export class Vec2 extends Vector2 {
  public extraColor?: Color;
  constructor(x = 0, y = 0) {
    super(x, y);
  }
  toVec3() {
    return new Vector3(this.x, this.y, 0);
  }
}

export class Ray {
  public k = 0;
  public b = 0;
  constructor(public position: Vec2, public direction: Vec2) {
    this.k = direction.y - this.position.y - (direction.x - this.position.x);
    this.b = position.y - position.x * this.k;
  }
}

export class Polygon {
  constructor(public path: Vec2[]) {}

  toTriangles() {
    const { path } = this;
  }

  inspection(point: Vec2): boolean {
    const ray = new Ray(point, new Vec2());
    // const nRay = new Ray(new Vec2(), point.clone().negate())

    const data = [...this.path, this.path[0]];
    let crossPointNumber = 0;
    for (let i = 1; i < data.length; i++) {
      const s = data[i - 1];
      const e = data[i];
      const line = new Line(s, e);
      const bool = line.crossRay(ray);
      crossPointNumber += bool ? 1 : 0;
    }
    return crossPointNumber % 2 == 1;
  }
}

export class Line {
  public k = 0;
  public b = 0;
  public p1: Vec2;
  public p2: Vec2;
  constructor(start: Vec2, end: Vec2) {
    const k = (end.y - start.y) / (end.x - start.x);
    start.extraColor = new Color(0xff0000);
    end.extraColor = new Color(0x0000ff);
    this.p1 = start;
    this.p2 = end;
    this.k = k;
    this.b = start.y - k * start.x;
  }

  getAxisYByAxisX(x: number) {
    return this.k * x + this.b;
  }
  getAxisXByAxisY(y: number) {
    return (y - this.b) / this.k;
  }

  getPixel1(): Vec2[] {
    const path = [];
    const { p1, p2 } = this;
    const startX = Math.floor(Math.min(p1.x, p2.x));
    const startY = Math.floor(Math.min(p1.y, p2.y));
    const endX = Math.ceil(Math.max(p1.x, p2.x));
    const endY = Math.ceil(Math.max(p1.y, p2.y));
    const length = new Vector2(startX, startY).distanceTo(
      new Vector2(endX, endY)
    );
    const sC = p1.extraColor || new Color(0xff0000);
    const eC = p2.extraColor || new Color(0x00ff00);
    if (this.k === 0) {
      let k = 0;
      for (let i = startX; i <= endX; i++) {
        const p = new Vec2(startX + k, startY);
        p.extraColor = new Color().lerpColors(sC, eC, 1 - k / length);
        path.push(p);
        k++;
      }
      return path;
    }
    if (this.k === Infinity || this.k === -Infinity) {
      let k = 0;
      for (let i = startY; i <= endY; i++) {
        const p = new Vec2(startX, startY + k);
        p.extraColor = new Color().lerpColors(sC, eC, 1 - k / length);
        path.push(p);
        k++;
      }
      return path;
    }

    if (this.k <= 1) {
      let k = 0;
      for (let i = startX; i <= endX; i++) {
        const p = new Vec2(
          startX + k,
          Math.round(this.getAxisYByAxisX(startX + k))
        );
        p.extraColor = new Color().lerpColors(sC, eC, 1 - k / length);
        path.push(p);
        k++;
      }
    }
    if (this.k > 1) {
      let k = 0;
      for (let i = startY; i <= endY; i++) {
        const p = new Vec2(
          Math.round(this.getAxisXByAxisY(startY + k)),
          startY + k
        );
        p.extraColor = new Color().lerpColors(sC, eC, 1 - k / length);
        path.push(p);
        k++;
      }
    }
    return path;
  }

  crossRay(ray: Ray): boolean {
    // const {k, b} = ray
    // let x: number;
    // let y: number;
    // const minx = Math.min(this.p1.x, this.p2.x);
    // const maxX = Math.max(this.p1.x, this.p2.x);
    // const minY = Math.min(this.p1.y, this.p2.y);
    // const maxY = Math.max(this.p1.y, this.p2.y);
    // if (this.k === Infinity || this.k === -Infinity) {
    //   y = k * this.p1.x;
    //   x = this.p1.x;
    //   return y > minY && y < maxY;
    // }
    // if (k === Infinity || k === -Infinity) {
    //   return 0 > minx && 0 < maxX;
    // }
    // x = (this.b - b) / (k - this.k);
    // y = k * x + b;
    // return x > minx && x < maxX;

    const pp1 = this.p1.clone().sub(ray.position.clone()).normalize();
    const pp2 = this.p2.clone().sub(ray.position.clone()).normalize();
    const pp3 = ray.direction.clone().sub(ray.position.clone()).normalize();
    if (pp1.length() === 0 || pp2.length() === 0 || pp3.length() === 0) {
      return false;
    }
    const a1 = pp2.dot(pp1);
    const a2 = pp3.dot(pp1);
    const c1 = pp2.cross(pp1);
    const c2 = pp3.cross(pp1);
    const equal = (c1 >= 0 && c2 >= 0) || (c1 < 0 && c2 < 0);
    return equal && Math.acos(a1) > Math.acos(a2);
  }
}

export class Triangle {
  constructor(public path: Vec2[]) {}

  inspection(point: Vec2): { color: Color; bool: boolean } {
    const [a, b, c] = this.path;
    const edgeC = point.clone().sub(a.clone()).cross(b.clone().sub(a.clone()));
    const edgeA = point.clone().sub(b.clone()).cross(c.clone().sub(b.clone()));
    const edgeB = point.clone().sub(c.clone()).cross(a.clone().sub(c.clone()));
    let bool =
      (edgeA >= 0 && edgeB >= 0 && edgeC >= 0) ||
      (edgeA < 0 && edgeB < 0 && edgeC < 0);

    if (
      point.distanceTo(a) === 0 ||
      point.distanceTo(b) === 0 ||
      point.distanceTo(c) === 0
    ) {
      bool = true;
    }

    const area = edgeA + edgeB + edgeC;
    const wa = new Color(a.extraColor || 0x666666).multiplyScalar(edgeA / area);
    const wb = new Color(b.extraColor || 0x666666).multiplyScalar(edgeB / area);
    const wc = new Color(c.extraColor || 0x666666).multiplyScalar(edgeC / area);
    const color = wa.clone();
    color.add(wb);
    color.add(wc);

    return {
      color,
      bool,
    };
  }

  getWightPoint(): Vec2 {
    const [a, b, c] = this.path;
    const point = a.clone();
    point.multiplyScalar(0.3333);
    point.add(b.clone().multiplyScalar(0.3333));
    point.add(c.clone().multiplyScalar(0.3333));
    return point;
  }
  isValid() {
    const [a, b, c] = this.path;
    return (
      a.distanceTo(b) !== 0 && a.distanceTo(c) !== 0 && c.distanceTo(b) !== 0
    );
  }
}

export function drawPoint(ctx: CanvasRenderingContext2D, point: Vec2) {
  if (!point) {
    return;
  }
  ctx.fillStyle = '#' + (point.extraColor?.getHexString() || '000000');
  ctx.beginPath();
  ctx.arc(point.x, point.y, 0.2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

export function drawAxis(
  ctx: CanvasRenderingContext2D,
  proj: Matrix3,
  color: string = '#eeeeee',
  lineWidth: number = 0.03
) {
  const [a, c, tx, b, d, ty] = proj.clone().transpose().toArray();

  ctx.fillStyle = color;
  // debugger
  ctx.lineWidth = lineWidth;
  ctx.transform(a, b, c, d, tx, ty);

  ctx.save();
  ctx.translate(-0.5, -0.5);
  const row = 200;
  ctx.strokeStyle = color;
  for (let i = 0; i < row; i++) {
    ctx.beginPath();
    ctx.moveTo(i - row / 2, 50);
    ctx.lineTo(i - row / 2, -50);
    ctx.stroke();
  }
  const col = 200;
  for (let i = 0; i < col; i++) {
    ctx.beginPath();
    ctx.moveTo(-col / 2, i - col / 2);
    ctx.lineTo(row / 2, i - col / 2);
    ctx.stroke();
  }
  ctx.restore();
  const origin = new Vec2();
  origin.extraColor = new Color(color || 0xeeeeee);
  drawPoint(ctx, origin);
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  point1: Vec2,
  point2: Vec2,
  dash: boolean = false,
  color: string = '#3366ff'
) {
  if (!point1 || !point2) {
    return;
  }
  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  if (dash) {
    ctx.setLineDash([0.5, 0.2]);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawCell(
  ctx: CanvasRenderingContext2D,
  cell: Vec2,
  color: string = '#aaaaaa'
) {
  ctx.save();
  ctx.translate(-0.4, -0.4);
  ctx.fillStyle = '#' + cell.extraColor?.getHexString() || color;
  ctx.beginPath();
  ctx.moveTo(cell.x, cell.y);
  ctx.lineTo(cell.x + 0.8, cell.y);
  ctx.lineTo(cell.x + 0.8, cell.y + 0.8);
  ctx.lineTo(cell.x, cell.y + 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  center: Vec2,
  radius: number
) {
  ctx.save();
  ctx.strokeStyle = '#aaaaaa';
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  center: Vec2,
  content: string,
  color: string = '#ff0000'
) {
  ctx.save();
  ctx.transform(1, 0, 0, -1, center.x, center.y);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.font = '1px bold';
  ctx.fillText(content, 0, 0);
  ctx.restore();
}

export function polygonIsTu(
  p1: Vec2,
  p2: Vec2,
  p3: Vec2,
  p4: Vec2,
  args?: Vec2[]
): boolean {
  const v1 = p3.clone().sub(p2.clone());
  const v2 = p1.clone().sub(p3.clone());
  const v3 = p4.clone().sub(p3.clone());
  const v4 = p1.clone().sub(p4.clone());
  if (
    p1.distanceTo(p3) === 0 ||
    p1.distanceTo(p4) === 0 ||
    p2.distanceTo(p3) === 0 ||
    p3.distanceTo(p4) === 0
  ) {
    return false;
  }
  return v1.cross(v2) / 0 == v4.cross(v3) / 0;
}

export function lineCross(p1: Vec2, p2: Vec2, p3: Vec2, p4: Vec2) {
  const isect = [NaN, NaN]; // the output vector where collision point is stored

  //                       seg 1                   seg 2
  //                ┌-------------------┐   ┌-----------------┐
  segseg(isect, p1.toArray(), p2.toArray(), p3.toArray(), p4.toArray());
  if (isNaN(isect[0]) && isNaN(isect[1])) {
    return false;
  }
  const p = new Vec2(...isect);
  if (
    p.distanceTo(p1) === 0 ||
    p.distanceTo(p2) === 0 ||
    p.distanceTo(p3) === 0 ||
    p.distanceTo(p4) === 0
  ) {
    return false;
  }

  return true;
}
