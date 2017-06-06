/**
 * Created by DengYun on 2017/6/4.
 */

import { prop, propSetter, nativeComponent } from "../../../NativeComponents/decorators";
import BaseGLNodeManager, { GLBaseNode } from "./BaseGLNodeManager";
import { rotate2D, scale2D, translate2D } from "../matrix";

function setAnimationInterval(onFrame) {
  let timer;
  function nextFrame() {
    if (timer !== null) {
      setNextFrame();
      onFrame();
    }
  }
  function setNextFrame() {
    timer = requestAnimationFrame(nextFrame);
  }
  setNextFrame();
  return () => {
    cancelAnimationFrame(timer);
    timer = null;
  }
}

class GLBasicSprite extends GLBaseNode {
  constructor() {
    super();
    this.resetTimer();
  }

  @prop
  columns = 1;

  @prop
  tileW = 0;

  @prop
  tileH = 0;

  interval = 0;
  animationData = [0];

  r = 0;
  g = 0;
  b = 0;
  a = 0;

  texture = null;

  textureUri = null;

  currentFrame = 0;
  disposeTimer = null;

  resetTimer() {
    if (this.disposeTimer !== null) {
      this.disposeTimer();
    }
    this.currentFrame = 0;
    if (this.interval > 0) {
      const timer = setInterval(this.onFrame, this.interval);
      this.disposeTimer = () => {
        clearInterval(timer);
      }
    } else {
      this.disposeTimer = setAnimationInterval(this.onFrame);
    }
  }

  onFrame = () => {
    if (++this.currentFrame >= this.animationData.length) {
      this.currentFrame = 0;
    }
  };

  renderGL(gl) {
    if (this.textureUri && !this.texture) {
      this.texture = gl.textureManager.obtain(this.textureUri);
    }
    if (this.texture ) {
      const frameId = this.animationData && this.animationData[this.currentFrame];
      if (frameId == null) {
        return;
      }
      const tx = this.tileW * (frameId % this.columns);
      const ty = this.tileH * ((frameId / this.columns) | 0);

      gl.painter2d.drawTexture(
        gl, this.texture,
        -0.5, -0.5, 1, 1,
        tx, ty, this.tileW, this.tileH,
        this.r, this.g, this.b, this.a,
      );
    }
  }
}

@nativeComponent('GLBasicSprite')
export default class GLBasicSpriteManager extends BaseGLNodeManager(GLBasicSprite) {

  @propSetter
  interval(view, value) {
    view.interval = value;
    view.resetTimer();
  }

  @propSetter
  animationData(view, value) {
    view.animationData = value;
    view.resetTimer();
  }

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

