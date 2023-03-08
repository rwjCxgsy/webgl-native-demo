import { mat4, vec3 } from 'gl-matrix';
import { Camera } from '../renderer/camera';
import THREE from 'three';

class Control {
  cameraRadius = 500; // 相机半径
  cameraPolarAngle = 0; // 相机极角
  cameraAzimuthalAngle = 0; // 相机方位角
  cameraTarget: vec3; // 相机目标点

  orbitControlEnabled = true; // 是否启用 OrbitControl
  orbitControlZoomSpeed = 0.5; // 缩放速度
  orbitControlRotateSpeed = 0.5; // 旋转速度
  orbitControlPanSpeed = 0.5; // 平移速度
  orbitControlMinRadius = 10; // 相机半径最小值
  orbitControlMaxRadius = Infinity; // 相机半径最大值

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
    // const v3 = vec3.create();

    const x = camera.position[0];
    const y = camera.position[1];
    const z = camera.position[2];

    this.cameraRadius = vec3.length(camera.position);
    this.cameraTarget = vec3.clone(camera.target);

    this.cameraPolarAngle = Math.acos(camera.position[2] / this.cameraRadius);
    this.cameraAzimuthalAngle = Math.atan2(
      camera.position[1],
      camera.position[0]
    );
    this.params.currentXAngle = (Math.atan(y / z) / Math.PI) * 180;
    this.params.currentYAngle = (Math.atan(x / z) / Math.PI) * 180;

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
      // 围绕y轴旋转
      this.params.currentYAngle = currentYAngle + (x - lastClickX) * incAngle;
      this.params.currentYAngle %= 360;
      // 围绕x轴旋转
      this.params.currentXAngle = currentXAngle + (y - lastClickY) * incAngle;
      this.params.currentXAngle = Math.min(this.params.currentXAngle, 89);
      this.params.currentXAngle = Math.max(this.params.currentXAngle, 1);

      this.cameraPolarAngle =
        ((90 - this.params.currentXAngle) / 180) * Math.PI;
      this.cameraAzimuthalAngle = (this.params.currentYAngle / 180) * Math.PI;

      this.updateCamera();
    }
    this.params.lastClickX = x;
    this.params.lastClickY = y;
    this.params.lastYAngle = this.params.currentYAngle;
    this.params.lastXAngle = this.params.currentXAngle;
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

  updateCamera() {
    const r = this.cameraRadius;

    const x =
      r * Math.sin(this.cameraPolarAngle) * Math.cos(this.cameraAzimuthalAngle);
    const y = r * Math.cos(this.cameraPolarAngle);
    const z =
      r * Math.sin(this.cameraPolarAngle) * Math.sin(this.cameraAzimuthalAngle);

    this.camera.setPosition(x, y, z);
  }

  destroy() {
    this.ele.removeEventListener('mousedown', this.onmousedown);
    this.ele.removeEventListener('mousemove', this.onmousemove);
    this.ele.removeEventListener('mouseup', this.onmouseup);
  }
}

export { Control };
