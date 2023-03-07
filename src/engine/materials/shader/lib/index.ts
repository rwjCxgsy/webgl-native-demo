import { Material } from '../../Material';
// import { TextureImage2D } from '../../../texture';
import * as textureLib from './texture';
import * as shadowLib from './shadow';
import * as colorLib from './color';

export function createShaderContent(material: Material) {
  // 添加纹理
  {
    const UseTextureFv = /#include \<texture-fv\>/gi;
    const UseTextureFc = /#include \<texture-fc\>/gi;

    let fv = ``;
    let fc = ``;
    material.textures?.forEach((_, index) => {
      fv += `${textureLib.fragV}\n`;
      fc += `${textureLib.fragC}\n`;
    });

    material.fs = material.fs.replace(UseTextureFv, fv);
    material.fs = material.fs.replace(UseTextureFc, fc);
  }
  // 添加阴影

  {
    const UseShadowVv = /#include \<shadow-vv\>/gi;
    const UseShadowVc = /#include \<shadow-vc\>/gi;

    material.vs = material.vs.replace(
      UseShadowVv,
      material.shadow ? shadowLib.vertV : ''
    );
    material.vs = material.vs.replace(
      UseShadowVc,
      material.shadow ? shadowLib.vertC : ''
    );

    const UseShadowFv = /#include \<shadow-fv\>/gi;
    const UseShadowFc = /#include \<shadow-fc\>/gi;

    material.fs = material.fs.replace(
      UseShadowFv,
      material.shadow ? shadowLib.fragV : ''
    );
    material.fs = material.fs.replace(
      UseShadowFc,
      material.shadow ? shadowLib.fragC : ''
    );
  }

  // 替换颜色
  {
    const UseColorFc = /#include \<color-fc\>/gi;

    material.fs = material.fs.replace(UseColorFc, colorLib.fragC);
  }
}
