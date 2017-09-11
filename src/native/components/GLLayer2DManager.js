/**
 * Created by DengYun on 2017/6/4.
 */

import { prop, nativeComponent } from 'react-native-web-platform/lib/Libraries/NativeComponents/decorators';
import BaseGLNodeManager, {GLContainer} from "./BaseGLNodeManager";

class GLLayer2D extends GLContainer {
  @prop x = 0;
  @prop y = 0;
  @prop width = 2;
  @prop height = 2;

  renderGL(gl) {
    gl.matrixStack.pushOrtho2D(this.width, this.height, this.x, this.y);
    super.renderGL(gl);
    gl.matrixStack.pop()
  }
}

@nativeComponent('GLLayer2D')
export default class GLLayer2DManager extends BaseGLNodeManager(GLLayer2D) {
}
