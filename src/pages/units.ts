import { Color, Vector2, Line3, Matrix3, Vector3 } from 'three';

export class Vec2 extends Vector2 {
  public extraColor?: Color;
  constructor(x = 0, y = 0) {
    super(x, y);
  }
}

export class Line extends Line3 {
  public k = 0;
  public b = 0;
  public p1: Vec2;
  public p2: Vec2;
  constructor(start: Vec2, end: Vec2) {
    const sV3 = new Vector3(start.x, start.y, 0);
    const eV3 = new Vector3(end.x, end.y, 0);
    const k = (end.y - start.y) / (end.x - start.x);
    super(sV3, eV3);
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
}

export function getRect(
  p1: Vec2,
  p2: Vec2
): { minX: number; maxX: number; minY: number; maxY: number } {
  let min = new Vec2(0, 0);
  let max = new Vec2(0, 0);
  min.x = p1.x;
  min.y = p1.y;
  max.x = p1.x;
  max.y = p1.y;

  // for (let i = 1; i < path.length; i++) {
  //   min.x = Math.min(min.x, path[i].x);
  //   min.y = Math.min(min.y, path[i].y);
  //   max.x = Math.max(max.x, path[i].x);
  //   max.y = Math.max(max.y, path[i].y);
  // }
}

export class Triangle {
  constructor(public path: Vec2[]) {}

  inspection(point: Vec2): { color: Color; bool: boolean } {
    const [a, b, c] = this.path;
    const edgeC = point.clone().sub(a.clone()).cross(b.clone().sub(a.clone()));
    const edgeA = point.clone().sub(b.clone()).cross(c.clone().sub(b.clone()));
    const edgeB = point.clone().sub(c.clone()).cross(a.clone().sub(c.clone()));
    const bool =
      (edgeA > 0 && edgeB > 0 && edgeC > 0) ||
      (edgeA < 0 && edgeB < 0 && edgeC < 0);

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
  color: string = '#3366ff'
) {
  if (!point1 || !point2) {
    return;
  }
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
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
