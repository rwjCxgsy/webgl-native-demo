import { ProgramInfo } from './type';

// 传递attribute
function bindAttrBuffer(gl: WebGLRenderingContext, entity: ProgramInfo) {
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
export { bindAttrBuffer };
