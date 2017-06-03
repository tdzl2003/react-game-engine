/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { directEvent, prop, domStyle, nativeComponent } from '../../NativeComponents/decorators';
import BaseViewManager from '../../NativeComponents/BaseViewManager';

class GLSurfaceAgent{

  view;
  gl;

  renderTimer;

  constructor(bridge, view, tag) {
    this.bridge = bridge;
    this.view = view;
    this.tag = tag;
    this.renderTimer = requestAnimationFrame(this.performRender);
  }

  render() {
    if (!this.gl) {
      this.initGL();
    }
    this.renderGL(this.gl);
  }

  performRender = () => {
    this.renderTimer = requestAnimationFrame(this.performRender);
    this.render();
  };

  renderGL(gl) {
    const canvas = this.view;
    const { offsetWidth, offsetHeight } = canvas;
    const ratio = window.devicePixelRatio || 1;
    const width = (offsetWidth * ratio) | 0;
    const height = (offsetHeight * ratio) | 0;
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.bridge.sendEvent(this.tag, 'onSizeChanged', {
        width,
        height,
        ratio,
      });
    }
    if (__DEV__) {
      gl.viewport(0, 0, width, height);
      gl.clearColor(0.0, 0.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }

  initGL() {
    const canvas = this.view;
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const ratio = window.devicePixelRatio || 1;

    const {offsetWidth, offsetHeight} = canvas;

    const width = this.width = (offsetWidth * ratio) | 0;
    const height = this.height = (offsetHeight * ratio) | 0;

    this.bridge.sendEvent(this.tag, 'onSurfaceCreated', {
      width,
      height,
      ratio,
    });

    // If we don't have a GL context, give up now
    if (!gl) {
      throw new Error('Unable to initialize WebGL. Your browser may not support it.');
    }

    this.gl = gl;
  }
}

@nativeComponent('GLSurface')
export default class GLSurfaceManager extends BaseViewManager {
  canvasInstanceRegistry = [];

  createView() {
    const canvas = document.createElement('canvas');
    return canvas;
  }

  setViewTag(view, tag) {
    super.setViewTag(view, tag);
    this.canvasInstanceRegistry[tag] = new GLSurfaceAgent(this.bridge, view, tag);
  }

  @domStyle
  flex;

  @domStyle
  position;

  @directEvent
  onSurfaceCreated;

  @directEvent
  onSizeChanged;
}
