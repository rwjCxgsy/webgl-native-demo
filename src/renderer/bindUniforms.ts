import { mat4 } from 'gl-matrix';
import { Object3D } from '../eneity';
import { Light } from '../light/light';
import { colorToArray } from '../utils/color';
import { Camera, ProgramInfo } from './type';

function transUniforms(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  options: {
    camera: Camera;
    object: Object3D;
    lights: Light[];
  }
) {
  const { camera, object, lights } = options;
  // 相机相关参数传递
  {
    const u_projection = gl.getUniformLocation(
      programInfo.program,
      'u_projection'
    );
    gl.uniformMatrix4fv(u_projection, false, camera.projection);
    const out = mat4.create();
    mat4.invert(out, camera.view);
    const u_camera = gl.getUniformLocation(programInfo.program, 'u_camera');
    gl.uniformMatrix4fv(u_camera, false, out);
    const u_modelView = gl.getUniformLocation(
      programInfo.program,
      'u_modelView'
    );
    gl.uniformMatrix4fv(u_modelView, false, object.modelView);
    //相机位置
    const u_cameraPosition = gl.getUniformLocation(
      programInfo.program,
      'u_cameraPosition'
    );
    gl.uniform3fv(u_cameraPosition, new Float32Array(camera.position));
  }

  // shadow 投影相关
  {
    const u_textureMatrix = gl.getUniformLocation(
      programInfo.program,
      'u_textureMatrix'
    );
    gl.uniformMatrix4fv(u_textureMatrix, false, camera.shadowView!);
  }

  // 纹理
  {
    const textures: WebGLTexture[] = [].concat(
      [],
      programInfo.textures,
      camera.shadowTexture ? [camera.shadowTexture] : []
    );
    // texture location
    textures?.forEach((v, index) => {
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(gl.TEXTURE_2D, v);
      gl.uniform1i(
        gl.getUniformLocation(programInfo!.program, 'u_texture' + index),
        index
      );
    });
  }

  const u_color = gl.getUniformLocation(programInfo.program, 'u_color');
  const u_time = gl.getUniformLocation(programInfo.program, 'u_time');
  const u_bias = gl.getUniformLocation(programInfo.program, 'u_bias');
  gl.uniform3fv(u_color, new Float32Array(colorToArray(object.material.color)));
  gl.uniform1f(u_time, object.material.time);

  gl.uniform1f(u_bias, object.material.u_bias);

  // 如果有灯光，将灯光添加到场景中的模型去
  const u_lightColor = gl.getUniformLocation(
    programInfo.program,
    'u_lightColor'
  );

  const u_lightPosition = gl.getUniformLocation(
    programInfo.program,
    'u_lightPosition'
  );
  const u_baseLightColor = gl.getUniformLocation(
    programInfo.program,
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
}

export { transUniforms };
