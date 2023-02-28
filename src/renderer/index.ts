import { Entity } from './../eneity/index';
import { mat4, vec3 } from 'gl-matrix';
import { Object3D } from '../eneity';
import { Light } from '../light/light';
import { createShaderProgram } from '../program';

import { ProgramInfo } from './type';

import { Camera } from './camera';
import { createDepthFrame, createPixelsTexture, createScene } from '../texture';
import { colorToArray } from '../utils/color';
import { Material } from '../materials/Material';
import { ShaderMaterial, ShadowMaterial } from '../materials';
import { CustomGeometry } from '../geometry/customGeometry';
import { LineMaterial } from '../materials/LineMaterial';
import { Geometry } from '../geometry/geometry';

const programMap: Map<Object3D, ProgramInfo> = new Map();

let bufferSize = new Set();

export enum RenderType {
  Shadow,
  Scene,
}

class Renderer {
  public gl: WebGLRenderingContext;
  depthTexture?: WebGLTexture;
  depthFramebuffer?: WebGLFramebuffer;
  depthTextureSize: number = 512;

  sceneTexture?: WebGLTexture;

  lastUsedProgramInfo?: WebGLProgram;
  lastUsedBufferInfo?: WebGLBuffer;

  renderType: RenderType = RenderType.Scene;

  shadowCamera = new Camera(120, 1, 10, 200);

  shadowProgram?: WebGLProgram;

  defaultTexture?: WebGLTexture;
  frustumEntity: Entity = new Entity(new CustomGeometry(), new LineMaterial());
  frustumProgramInfo?: ProgramInfo;
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
    gl.getExtension('OES_element_index_uint');
    ele.width =
      (window.innerWidth || document.documentElement.clientWidth) *
      window.devicePixelRatio;
    (ele.height = window.innerHeight || document.documentElement.clientHeight) *
      window.devicePixelRatio;
    ele.style.width =
      (window.innerWidth || document.documentElement.clientWidth) + 'px';
    ele.style.height =
      (window.innerHeight || document.documentElement.clientHeight) + 'px';

    this.shadowCamera.lookAt(0, 0, 0);

    this.shadowProgram = createShaderProgram(gl, new ShadowMaterial());

    this.defaultTexture = createPixelsTexture(this.gl);

    const { depthTexture, depthFramebuffer } = createDepthFrame(
      this.gl,
      this.depthTextureSize
    );

    // const { fb: depthFramebuffer, targetTexture: depthTexture } = createScene(
    //   this.gl
    // );
    this.depthTexture = depthTexture;
    this.depthFramebuffer = depthFramebuffer;
  }

  transUniforms(
    programInfo: ProgramInfo,
    options: {
      camera: Camera;
      object: Object3D;
      lights: Light[];
    }
  ) {
    const { gl } = this;
    const { camera, object, lights } = options;
    // 相机相关参数传递
    {
      //相机位置
      const u_cameraPosition = gl.getUniformLocation(
        programInfo.program,
        'u_cameraPosition'
      );
      u_cameraPosition &&
        gl.uniform3fv(u_cameraPosition, new Float32Array(camera.position));

      if (this.renderType === RenderType.Shadow) {
        const u_color = gl.getUniformLocation(programInfo.program, 'u_color');
        const c = new Float32Array(colorToArray(object.material.color));

        gl.uniform3fv(u_color, c);
        return;
      }
    }

    // shadow 投影相关
    {
      const u_textureMatrix = gl.getUniformLocation(
        programInfo.program,
        'u_textureMatrix'
      );
      u_textureMatrix &&
        gl.uniformMatrix4fv(u_textureMatrix, false, camera.shadowView!);
    }

    // 纹理
    {
      // texture location

      let k = 0;
      programInfo.textures?.forEach((v) => {
        const location = gl.getUniformLocation(
          programInfo!.program,
          'u_texture' + k
        );
        location && gl.activeTexture(gl.TEXTURE0 + k);
        location && gl.bindTexture(gl.TEXTURE_2D, v);
        location && gl.uniform1i(location, k);
        k++;
      });

      const shadowTextureLocation = gl.getUniformLocation(
        programInfo!.program,
        'u_projectedTexture'
      );
      if (
        this.renderType === RenderType.Scene &&
        this.depthTexture &&
        shadowTextureLocation
      ) {
        gl.activeTexture(gl.TEXTURE0 + k);
        gl.bindTexture(gl.TEXTURE_2D, this.depthTexture!);
        gl.uniform1i(shadowTextureLocation, k);
      }
    }

    const u_color = gl.getUniformLocation(programInfo.program, 'u_color');
    const u_time = gl.getUniformLocation(programInfo.program, 'u_time');
    const u_bias = gl.getUniformLocation(programInfo.program, 'u_bias');

    u_color &&
      gl.uniform3fv(
        u_color,
        new Float32Array(colorToArray(object.material.color))
      );

    u_time && gl.uniform1f(u_time, object.material.time);

    u_bias && gl.uniform1f(u_bias, object.material.u_bias);

    // 如果有灯光，将灯光添加到场景中的模型去
    lights.forEach((light) => {
      switch (light.type) {
        case 'PointLight':
          const u_lightColor = gl.getUniformLocation(
            programInfo.program,
            'u_lightColor'
          );

          const u_lightPosition = gl.getUniformLocation(
            programInfo.program,
            'u_lightPosition'
          );
          u_lightColor && gl.uniform3fv(u_lightColor, light.color);

          u_lightPosition && gl.uniform3fv(u_lightPosition, light.position);

          break;
        case 'AmbientLight':
          const u_baseLightColor = gl.getUniformLocation(
            programInfo.program,
            'u_baseLightColor'
          );
          u_baseLightColor && gl.uniform3fv(u_baseLightColor, light.color);
          break;
        default:
          break;
      }
    });
  }

  // 传递attribute
  bindAttrBuffer(entity: ProgramInfo) {
    const { gl } = this;
    const a_position = gl.getAttribLocation(entity.program, 'a_position');
    const a_normal = gl.getAttribLocation(entity.program, 'a_normal');
    const a_texcoord = gl.getAttribLocation(entity.program, 'a_texcoord');
    gl.enableVertexAttribArray(a_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.position!);
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

    if (a_normal >= 0) {
      gl.enableVertexAttribArray(a_normal);
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.normal!);
      gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);
    }

    if (a_texcoord >= 0) {
      gl.enableVertexAttribArray(a_texcoord);
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.texcoord!);
      gl.vertexAttribPointer(a_texcoord, 2, gl.FLOAT, false, 0, 0);
    }
  }

  creteBuffer(type: number, data: ArrayBuffer) {
    const { gl } = this;
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return buffer;
  }

  createAttributes(geometry: Geometry): {
    buffers: { [key: string]: WebGLBuffer };
    indicesBuffer?: WebGLBuffer;
  } {
    const { gl } = this;
    const buffers: { [key: string]: WebGLBuffer } = {};
    Object.entries(geometry.attr).forEach(([key, data]) => {
      const buffer = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      buffers[key] = buffer;
    });

    const indicesBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices!, gl.STATIC_DRAW);
    return {
      indicesBuffer,
      buffers,
    };
  }

  setUniformMatrix(
    programInfo: ProgramInfo,
    obj: Entity,
    camera: {
      projectionMatrix: mat4;
      viewMatrix: mat4;
    }
  ) {
    const { gl } = this;
    const u_projection = gl.getUniformLocation(
      programInfo.program,
      'u_projection'
    );
    gl.uniformMatrix4fv(u_projection, false, camera.projectionMatrix);
    const out = mat4.create();
    mat4.invert(out, camera.viewMatrix);
    const u_camera = gl.getUniformLocation(programInfo.program, 'u_camera');
    gl.uniformMatrix4fv(u_camera, false, out);
    const u_modelView = gl.getUniformLocation(
      programInfo.program,
      'u_modelView'
    );
    gl.uniformMatrix4fv(u_modelView, false, obj.modelView);
  }

  renderObject(camera: Camera, scene: Set<Object3D>, lights: Array<Light>) {
    const { gl } = this;

    let currentProgram: ProgramInfo;
    scene.forEach((obj) => {
      // if (obj.name === 'sky') {
      //   return;
      // }
      let programInfo = programMap.get(obj);
      if (!programInfo) {
        programInfo = {
          program: createShaderProgram(gl, obj.material),
          buffers: {},
          textures: new Set(),
        };

        if (obj.material.textures?.length) {
          obj.material.textures.forEach((v) => {
            const texture = v.load(gl);
            programInfo!.textures?.add(texture);
          });
        }
        const { indicesBuffer, buffers } = this.createAttributes(obj.geometry);
        programInfo.buffers = buffers;
        programInfo.indicesBuffer = indicesBuffer;
        programMap.set(obj, programInfo);
      }

      if (this.renderType === RenderType.Scene) {
        // 切换program
        gl.useProgram(programInfo.program);
        currentProgram = programInfo;
      } else {
        gl.useProgram(this.shadowProgram!);
        currentProgram = {
          program: this.shadowProgram!,
          buffers: {},
          textures: new Set(),
        };
      }

      // 顶点相关数据传递
      this.bindAttrBuffer(programInfo);

      this.setUniformMatrix(currentProgram, obj, {
        projectionMatrix: camera.projectionMatrix,
        viewMatrix: camera.viewMatrix,
      });
      // 传递uniforms
      this.transUniforms(currentProgram, { camera, lights, object: obj });

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programInfo.indicesBuffer!);

      gl.drawElements(
        gl.TRIANGLES,
        // @ts-ignore
        obj.geometry.indices!.length,
        gl.UNSIGNED_SHORT,
        0
      );
    });
    bufferSize.clear();
  }

  renderShadowTexture(scene: Set<Object3D>, lights: Array<Light>) {
    // 表示从灯光位置照射 原点
    this.shadowCamera.position = lights.find(
      (v) => v.type === 'PointLight'
    )!.position;
    this.renderType = RenderType.Shadow;
    const { gl } = this;
    // gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthFramebuffer!);
    gl.viewport(0, 0, this.depthTextureSize, this.depthTextureSize);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.renderObject(this.shadowCamera, scene, lights);
  }

  render(camera: Camera, scene: Set<Object3D>, lights: Array<Light>) {
    const { gl } = this;

    this.renderType = RenderType.Scene;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    // gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const m4v = mat4.create();
    mat4.invert(m4v, this.shadowCamera.viewMatrix);
    const mat = mat4.create();
    mat4.multiply(mat, this.shadowCamera.projectionMatrix, m4v);

    camera.shadowView = mat;
    this.renderObject(camera, scene, lights);
  }

  renderFrustum(camera: Camera) {
    const { gl } = this;

    let { frustumProgramInfo } = this;
    if (!frustumProgramInfo) {
      const program = createShaderProgram(gl, this.frustumEntity.material);
      const { buffers, indicesBuffer } = this.createAttributes(
        this.frustumEntity.geometry
      );
      frustumProgramInfo = {
        program,
        buffers,
        indicesBuffer,
        textures: new Set(),
      };
    }
    gl.useProgram(frustumProgramInfo.program);

    // const viewMatrix = mat4.create();
    // mat4.invert(viewMatrix, camera.viewMatrix);

    // scale the cube in Z so it's really long
    // to represent the texture is being projected to
    // infinity

    this.shadowCamera.lookAt(0, 0, 0);

    const m4v = mat4.create();
    mat4.invert(m4v, this.shadowCamera.projectionMatrix);
    const mat = mat4.create();
    mat4.multiply(mat, this.shadowCamera.viewMatrix, m4v);

    this.bindAttrBuffer(frustumProgramInfo);

    this.frustumEntity.modelView = mat;
    this.setUniformMatrix(frustumProgramInfo, this.frustumEntity, {
      projectionMatrix: camera.projectionMatrix,
      viewMatrix: camera.viewMatrix,
    });

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, frustumProgramInfo.indicesBuffer!);

    gl.drawElements(
      gl.LINES,
      // @ts-ignore
      this.frustumEntity.geometry.indicesLength,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}

export { Renderer };
