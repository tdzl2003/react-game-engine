/**
 * Created by DengYun on 2017/6/4.
 */

import { prop, propSetter, nativeComponent } from 'react-native-web-platform/lib/Libraries/NativeComponents/decorators';
import BaseGLNodeManager, { GLBaseNode } from "./BaseGLNodeManager";

class GLRect2D extends GLBaseNode {
  @prop x = 0;
  @prop y = 0;
  @prop w = 0;
  @prop h = 0;

  r = 0;
  g = 0;
  b = 0;
  a = 0;

  renderGL(gl) {
    gl.painter2d.drawRect(
      gl,
      this.x, this.y, this.w, this.h,
      this.r, this.g, this.b, this.a,
    );
  }
}

@nativeComponent('GLRect2D')
export default class GLRect2DManager extends BaseGLNodeManager(GLRect2D) {

  @propSetter
  color(view, value) {
    view.r = ((value >> 24) & 0xff) / 255;
    view.g = ((value >> 16) & 0xff) / 255;
    view.b = ((value >> 8) & 0xff) / 255;
    view.a = (value & 0xff) / 255;
  }

}
