/**
 * Created by DengYun on 2017/6/4.
 */

import { prop, propSetter, nativeComponent } from 'react-native-web-platform/lib/Libraries/NativeComponents/decorators';
import BaseGLNodeManager, { GLBaseNode } from "./BaseGLNodeManager";

class GLImage extends GLBaseNode {
  @prop x = 0;
  @prop y = 0;
  @prop w = 0;
  @prop h = 0;

  @prop tx = 0;
  @prop ty = 0;
  @prop tw = 1;
  @prop th = 1;

  r = 0;
  g = 0;
  b = 0;
  a = 0;

  texture = null;

  textureUri = null;

  renderGL(gl) {
    if (this.textureUri && !this.texture) {
      this.texture = gl.textureManager.obtain(this.textureUri);
    }
    if (this.texture) {
      gl.painter2d.drawTexture(
        gl, this.texture,
        this.x, this.y, this.w, this.h,
        this.tx, this.ty, this.tw, this.th,
        this.r, this.g, this.b, this.a,
      );
    }
  }
}

@nativeComponent('GLImage')
export default class GLImageManager extends BaseGLNodeManager(GLImage) {

  @propSetter
  color(view, value) {
    view.r = ((value >> 24) & 0xff) / 255;
    view.g = ((value >> 16) & 0xff) / 255;
    view.b = ((value >> 8) & 0xff) / 255;
    view.a = (value & 0xff) / 255;
  }

  @propSetter
  src(view, value) {
    if (view.texture) {
      view.texture.release();
      view.texture = null;
    }
    view.textureUri = value;
  }

}

