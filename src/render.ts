import { mat4, vec3 } from 'gl-matrix';
import { createShaderProgram } from './program';

type Shaders = [string, string];

export type EntityData = {
  attributes: {
    position: Float32Array;
    normals?: Float32Array;
    color?: Float32Array;
    uv?: Float32Array;
  };
  uniforms?: {
    color: vec3;
  };
};

export interface Camera {
  projection: mat4;
  view: mat4;
  position: vec3;
}

export type LightType = 'base' | 'point';

export class Light {
  constructor(
    public color: vec3,
    public type: LightType,
    public position: vec3 = vec3.create()
  ) {
    this.color = vec3.create();
    this.color[0] = color[0];
    this.color[1] = color[1];
    this.color[2] = color[2];
    this.position[0] = position[0];
    this.position[1] = position[1];
    this.position[2] = position[2];
  }
}

type Entity = {
  program: WebGLProgram;
  buffers: {
    [key: string]: WebGLBuffer;
  };
};

export class Object3D {
  public id: string;
  public modelView: mat4 = mat4.create();
  public position: vec3 = vec3.create();

  public xRotate: number = 0;
  public yRotate: number = 0;
  public zRotate: number = 0;

  constructor(
    public shader: Shaders,
    public data: EntityData,
    public renderType: number = 0x4
  ) {
    this.id = Math.random().toString().substring(2);
  }

  transform() {
    const translate = mat4.create();

    mat4.translate(translate, mat4.create(), this.position);

    const rotateXyz = mat4.create();
    mat4.rotateX(rotateXyz, mat4.create(), this.xRotate);
    mat4.rotateY(rotateXyz, rotateXyz, this.yRotate);
    mat4.rotateZ(rotateXyz, rotateXyz, this.zRotate);

    mat4.multiply(this.modelView, rotateXyz, translate);
  }

  setPosition(position: vec3) {
    this.position = position;
    this.transform();
  }

  rotateX(radius: number) {
    this.xRotate = (Math.PI / 180) * radius;
    this.transform();
  }
  rotateY(radius: number) {
    this.yRotate = (Math.PI / 180) * radius;
    this.transform();
  }
  rotateZ(radius: number) {
    this.zRotate = (Math.PI / 180) * radius;
    this.transform();
  }
}

function translate(input: Float32Array, position: vec3): Float32Array {
  const transMat = mat4.create();
  mat4.translate(transMat, mat4.create(), position);

  const out = input.slice(0);

  for (let i = 0; i < input.length; i += 3) {
    const point = vec3.create();
    point[0] = input[i];
    point[1] = input[i + 1];
    point[2] = input[i + 2];
    const outer = vec3.create();
    vec3.transformMat4(outer, point, transMat);
    out[i] = outer[0];
    out[i + 1] = outer[1];
    out[i + 2] = outer[2];
  }
  return out;
}

const entityMap: Map<Object3D, Entity> = new Map();
// const lights: Light[] = [];
function renderScene(
  gl: WebGLRenderingContext,
  camera: Camera,
  list: Set<Object3D>,
  lights: Array<Light>
) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  list.forEach((obj) => {
    let entity = entityMap.get(obj);
    if (!entity) {
      entity = {
        program: createShaderProgram(gl, obj.shader[0], obj.shader[1]),
        buffers: {},
      };

      Object.entries(obj.data.attributes).forEach(([key, originData]) => {
        let data = originData;
        if (vec3.length(obj.position) > 0) {
          data = translate(originData, obj.position);
        }

        const buffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        entity!.buffers[key] = buffer;
      });
      entityMap.set(obj, entity);
    }
    const a_position = gl.getAttribLocation(entity.program, 'a_position');
    const a_normal = gl.getAttribLocation(entity.program, 'a_normal');
    const a_color = gl.getAttribLocation(entity.program, 'a_color');

    const u_color = gl.getUniformLocation(entity.program, 'u_color');
    const u_projection = gl.getUniformLocation(entity.program, 'u_projection');
    const u_camera = gl.getUniformLocation(entity.program, 'u_camera');
    const u_modelView = gl.getUniformLocation(entity.program, 'u_modelView');

    const u_lightColor = gl.getUniformLocation(entity.program, 'u_lightColor');

    const u_lightPosition = gl.getUniformLocation(
      entity.program,
      'u_lightPosition'
    );
    const u_baseLightColor = gl.getUniformLocation(
      entity.program,
      'u_baseLightColor'
    );

    //相机位置
    const u_cameraPosition = gl.getUniformLocation(
      entity.program,
      'u_cameraPosition'
    );

    gl.useProgram(entity.program);

    gl.enableVertexAttribArray(a_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.position!);
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

    if (a_color >= 0) {
      gl.enableVertexAttribArray(a_color);
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.color!);
      gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);
    }

    if (a_normal >= 0) {
      gl.enableVertexAttribArray(a_normal);
      gl.bindBuffer(gl.ARRAY_BUFFER, entity.buffers.normals!);
      gl.vertexAttribPointer(a_normal, 3, gl.FLOAT, false, 0, 0);
    }

    gl.uniformMatrix4fv(u_projection, false, camera.projection);
    gl.uniformMatrix4fv(u_camera, false, camera.view);

    gl.uniformMatrix4fv(u_modelView, false, obj.modelView);

    gl.uniform3fv(u_cameraPosition, new Float32Array(camera.position));
    if (obj.data.uniforms) {
      gl.uniform3fv(u_color, new Float32Array(obj.data.uniforms.color));
    }

    // 如果有灯光，将灯光添加到场景中的模型去

    lights.forEach((light) => {
      switch (light.type) {
        case 'point':
          gl.uniform3fv(u_lightColor, light.color);
          gl.uniform3fv(u_lightPosition, light.position);

          break;
        case 'base':
          gl.uniform3fv(u_baseLightColor, light.color);
          break;
        default:
          break;
      }
    });

    gl.drawArrays(obj.renderType, 0, obj.data.attributes.position.length / 3);
  });
}

export { renderScene };
