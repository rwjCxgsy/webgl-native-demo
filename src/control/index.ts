import { mat4 } from 'gl-matrix';
import { Camera } from '../renderer/camera';

class Control {
  params = {
    xOffset: 0, //x方向移动步长值
    yOffset: 0, //y方向移动步长值
    incAngle: 0.5, //旋转角度步长值
    currentYAngle: 0, //绕y轴旋转角度
    currentXAngle: 0, //绕x轴旋转角度
    lastXAngle: 0, //
    lastYAngle: 0,
    lastClickX: 0,
    lastClickY: 0, //上次触控点X,Y坐标
    ismoved: false, //是否移动标志位
    down: false, //是否点击标志位
    sunx: 3000, //光源x坐标
    sunz: 0, //光源y坐标
    sunRadius: 2500, //光源旋转半径
    sunAngle: Math.PI / 2, //光照初始旋转角度
  };
  constructor(public ele: HTMLCanvasElement, public camera: Camera) {
    ele.addEventListener('mousedown', this.onmousedown);
    ele.addEventListener('mousemove', this.onmousemove);
    ele.addEventListener('mouseup', this.onmouseup);
  }
  onmousedown = (event: MouseEvent) => {
    event.preventDefault(); // 阻止浏览器默认事件，重要
    //如果鼠标在<canvas>内开始移动

    // @ts-ignore
    if (event.target.tagName == 'CANVAS') {
      this.params.lastClickX = event.clientX;
      this.params.lastClickY = event.clientY;
      this.params.ismoved = true;
      this.params.down = true;
    }
  };
  onmousemove = (event: MouseEvent) => {
    const {
      ismoved,
      incAngle,
      lastClickX,
      lastClickY,
      currentYAngle,
      currentXAngle,
    } = this.params;
    //鼠标移动
    event.preventDefault(); // 阻止浏览器默认事件，重要
    var x = event.clientX,
      y = event.clientY;
    if (ismoved) {
      this.params.down = false;
      this.params.currentYAngle = currentYAngle + (x - lastClickX) * incAngle;
      this.params.currentXAngle = currentXAngle + (y - lastClickY) * incAngle;
      if (currentXAngle > 90) {
        this.params.currentXAngle = 90;
      } //设置旋转的角度为90
      else if (currentXAngle < -0) {
        this.params.currentXAngle = -0;
      } //设置旋转的角度为-90

      const { target } = this.camera;
      const [_x, _y, _z] = target;

      // const radius = this.camera.eyeToTargetDistance();

      // const a_x = Math.sin(this.params.currentYAngle) * radius + _x;
      // const a_y = Math.cos(this.params.currentXAngle) * radius + _y;

      // this.camera.rotate(this.params.currentXAngle, [1, 0, 0]);

      // this.camera.rotate(this.params.currentYAngle, [0, 1, 0]);

      {
        const m4 = mat4.create();
        mat4.rotate(
          m4,
          mat4.create(),
          (Math.PI / 180) *
            (this.params.currentXAngle - this.params.lastXAngle),
          [1, 0, 0]
        );

        this.camera.multiply(m4);
      }
      {
        const m4 = mat4.create();
        mat4.rotate(
          m4,
          mat4.create(),
          (Math.PI / 180) *
            (this.params.currentYAngle - this.params.lastYAngle),
          [0, 1, 0]
        );

        this.camera.multiply(m4);
      }

      // this.camera.target[0] = a_x;
      // this.camera.target[1] = a_y;

      // this.camera;
    }
    this.params.lastClickX = x;
    this.params.lastClickY = y;
    this.params.lastYAngle = this.params.currentYAngle;
    this.params.lastXAngle = this.params.currentXAngle;

    // console.log(this.params.currentYAngle);
    // console.log(this.params.currentXAngle);
  };
  onmouseup = () => {
    const { down, lastClickX, lastClickY } = this.params;
    this.params.ismoved = false; //抬起鼠标
    if (down) {
      if (lastClickX < 400) {
        this.params.xOffset += 4;
      } else if (lastClickX > 400 && lastClickX < 800 && lastClickY < 400) {
        this.params.yOffset += 4;
      } else if (lastClickX > 400 && lastClickX < 800 && lastClickY > 400) {
        this.params.yOffset -= 4;
      } else if (lastClickX > 800) {
        this.params.xOffset -= 4;
      }
    }
  };
}

export { Control };
