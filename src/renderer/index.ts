import { mat4, vec3 } from 'gl-matrix';
import { Object3D } from '../eneity';
import { Light } from '../light/light';
import { createShaderProgram } from '../program';
// import { TextureImage2D } from './texture';
import { drawBufferInfo } from '../utils';
import { colorToArray } from '../utils/color';
import { Camera, ProgramInfo } from './type';
import { bindAttrBuffer } from './bindAttributes';
import { transUniforms } from './bindUniforms';

const programMap: Map<Object3D, ProgramInfo> = new Map();

class Renderer {
  public gl: WebGLRenderingContext;
  constructor(
    public ele: HTMLCanvasElement,
    public options?: {
      width: number;
      height: number;
    }
  ) {
    const gl = (this.gl = ele.getContext('webgl', { antialias: true })!);
    // 获取深度纹理
    gl.getExtension('WEBGL_depth_texture');
    ele.width =
      (window.innerWidth || document.documentElement.clientWidth) *
      window.devicePixelRatio;
    (ele.height = window.innerHeight || document.documentElement.clientHeight) *
      window.devicePixelRatio;
    ele.style.width =
      (window.innerWidth || document.documentElement.clientWidth) + 'px';
    ele.style.height =
      (window.innerHeight || document.documentElement.clientHeight) + 'px';
  }

  render(
    camera: Camera,
    list: Set<Object3D>,
    lights: Array<Light>,
    time: number = 0
  ) {
    camera = Object.assign(
      {},
      {
        projection: mat4.create(),
        view: mat4.create(),
        position: vec3.create(),
        shadowProjection: mat4.create(),
        shadowView: mat4.create(),
      },
      camera
    );

    const { gl } = this;
    list.forEach((obj) => {
      let programInfo = programMap.get(obj);
      if (!programInfo) {
        programInfo = {
          program: createShaderProgram(gl, obj.material.vs, obj.material.fs),
          buffers: {},
          textures: [],
          indicesBuffer: WebGLBuffer,
        };

        if (obj.material.textures?.length) {
          obj.material.textures.forEach((v) => {
            const texture = v.load(gl);
            programInfo!.textures?.push(texture);
          });
        }
        Object.entries(obj.geometry.attr).forEach(([key, data]) => {
          const buffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          programInfo!.buffers[key] = buffer;
        });

        if (obj.geometry.indices) {
          const buffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
          gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            obj.geometry.indices,
            gl.STATIC_DRAW
          );
          programInfo.indicesBuffer = buffer;
        }
        programMap.set(obj, programInfo);
      }

      gl.useProgram(programInfo.program);

      // 顶点相关数据传递
      bindAttrBuffer(gl, programInfo);

      // 传递uniforms
      transUniforms(gl, programInfo, { camera, lights, object: obj });

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programInfo.indicesBuffer!);

      drawBufferInfo(
        gl,
        { indices: obj.geometry.indices },
        gl.TRIANGLES,
        obj.geometry.indicesLength
      );
    });
  }
}

export { Renderer };
