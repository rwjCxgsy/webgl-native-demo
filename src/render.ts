import { mat4, vec3 } from 'gl-matrix';
import { Object3D } from './eneity';
import { Light } from './light/light';
import { createShaderProgram } from './program';
import { TextureImage2D } from './texture';
import { drawBufferInfo } from './utils';
import { colorToArray } from './utils/color';

export interface Camera {
  projection: mat4;
  view: mat4;
  position: vec3;
  shadowProjection?: mat4;
  shadowView?: mat4;
  shadowTexture?: WebGLTexture;
}

type Entity = {
  program: WebGLProgram;
  buffers: {
    [key: string]: WebGLBuffer;
  };
  textures: Array<WebGLTexture>;
  indicesBuffer?: WebGLBuffer;
};

const entityMap: Map<Object3D, Entity> = new Map();

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
      // if (obj.)
      let entity = entityMap.get(obj);
      if (!entity) {
        entity = {
          program: createShaderProgram(gl, obj.material.vs, obj.material.fs),
          buffers: {},
          textures: [],
          indicesBuffer: WebGLBuffer,
        };

        if (obj.material.textures?.length) {
          obj.material.textures.forEach((v) => {
            const texture = v.load(gl);
            entity!.textures?.push(texture);
          });
        }
        Object.entries(obj.geometry.attr).forEach(([key, data]) => {
          const buffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          entity!.buffers[key] = buffer;
        });

        if (obj.geometry.indices) {
          const buffer = gl.createBuffer()!;
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
          gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            obj.geometry.indices,
            gl.STATIC_DRAW
          );
          entity.indicesBuffer = buffer;
        }
        entityMap.set(obj, entity);
      }

      gl.useProgram(entity.program);

      // 顶点相关数据传递
      {
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

      // 相机相关参数传递
      {
        const u_projection = gl.getUniformLocation(
          entity.program,
          'u_projection'
        );
        gl.uniformMatrix4fv(u_projection, false, camera.projection);
        const out = mat4.create();
        mat4.invert(out, camera.view);
        const u_camera = gl.getUniformLocation(entity.program, 'u_camera');
        gl.uniformMatrix4fv(u_camera, false, out);
        const u_modelView = gl.getUniformLocation(
          entity.program,
          'u_modelView'
        );
        gl.uniformMatrix4fv(u_modelView, false, obj.modelView);
        //相机位置
        const u_cameraPosition = gl.getUniformLocation(
          entity.program,
          'u_cameraPosition'
        );
        gl.uniform3fv(u_cameraPosition, new Float32Array(camera.position));
      }

      // shadow 投影相关
      {
        const u_textureMatrix = gl.getUniformLocation(
          entity.program,
          'u_textureMatrix'
        );
        gl.uniformMatrix4fv(u_textureMatrix, false, camera.shadowView!);
      }

      // 纹理
      {
        const textures: WebGLTexture[] = [].concat(
          [],
          entity.textures,
          camera.shadowTexture ? [camera.shadowTexture] : []
        );
        // texture location
        textures?.forEach((v, index) => {
          gl.activeTexture(gl.TEXTURE0 + index);
          gl.bindTexture(gl.TEXTURE_2D, v);
          gl.uniform1i(
            gl.getUniformLocation(entity!.program, 'u_texture' + index),
            index
          );
        });
      }

      const u_color = gl.getUniformLocation(entity.program, 'u_color');
      const u_time = gl.getUniformLocation(entity.program, 'u_time');

      const u_bias = gl.getUniformLocation(entity.program, 'u_bias');

      gl.uniform3fv(
        u_color,
        new Float32Array(colorToArray(obj.material.color))
      );
      gl.uniform1f(u_time, obj.material.time);

      gl.uniform1f(u_bias, obj.material.u_bias);

      // 如果有灯光，将灯光添加到场景中的模型去
      const u_lightColor = gl.getUniformLocation(
        entity.program,
        'u_lightColor'
      );

      const u_lightPosition = gl.getUniformLocation(
        entity.program,
        'u_lightPosition'
      );
      const u_baseLightColor = gl.getUniformLocation(
        entity.program,
        'u_baseLightColor'
      );
      lights.forEach((light) => {
        switch (light.type) {
          case 'PointLight':
            gl.uniform3fv(u_lightColor, light.color);
            gl.uniform3fv(u_lightPosition, light.position);

            break;
          case 'AmbientLight':
            gl.uniform3fv(u_baseLightColor, light.color);
            break;
          default:
            break;
        }
      });

      // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.indicesBuffer!);

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
