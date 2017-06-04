/**
 * Created by DengYun on 2017/6/4.
 */

import { prop, nativeComponent } from "../../../NativeComponents/decorators";
import BaseGLNodeManager, {GLContainer} from "./BaseGLNodeManager";
import { rotate2D, scale2D, translate2D } from "../matrix";

class GLNode2D extends GLContainer {
  @prop x = 0;
  @prop y = 0;
  @prop rotate = 0;
  @prop scaleX = 1;
  @prop scaleY = 1;

  renderGL(gl) {
    const { matrixStack } = gl;
    matrixStack.push();
    const { top } = matrixStack;
    scale2D(top, this.scaleX, this.scaleY);
    rotate2D(top, this.rotate);
    translate2D(top, this.x, this.y);

    super.renderGL(gl);
    matrixStack.pop();
  }
}

@nativeComponent('GLNode2D')
export default class GLNode2DManager extends BaseGLNodeManager(GLNode2D) {
}
