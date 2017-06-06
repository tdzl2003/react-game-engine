/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { directEvent, propSetter, domStyle, nativeComponent } from '../../../NativeComponents/decorators';
import BaseViewManager from '../../../NativeComponents/BaseViewManager';
import MatrixStack from "../matrix";
import BatchDraw2D from "../BatchDraw2D";
import AssetManager from "../AssetsManager";
import Effect from "../Effect";
import {ImageTexture} from "../Texture";

class GLSurfaceAgent{
  view;
  gl;

  renderTimer;

  layers;

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
    if (this.gl) {
      this.renderGL(this.gl);
    }
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
    if (width !== canvas.width || height !== canvas.height) {
      canvas.width = width;
      canvas.height = height;
      this.bridge.sendEvent(this.tag, 'onSizeChanged', {
        width: offsetWidth,
        height: offsetHeight,
        ratio,
      });
    }
    gl.viewport(0, 0, width, height);
    if (__DEV__) {
      gl.clearColor(0.0, 0.0, 1.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    if (this.layers) {
      for (const layer of this.layers) {
        layer.renderGL(gl);
      }
    }

    gl.painter2d.flush(gl);
  }

  initGL() {
    const canvas = this.view;
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const ratio = window.devicePixelRatio || 1;

    const {offsetWidth, offsetHeight} = canvas;

    const width = canvas.width = (offsetWidth * ratio) | 0;
    const height = canvas.height = (offsetHeight * ratio) | 0;

    this.bridge.sendEvent(this.tag, 'onSurfaceCreated', {
      width: offsetWidth,
      height: offsetHeight,
      ratio,
    });

    gl.viewport(0, 0, width, height);

    // If we don't have a GL context, give up now
    if (!gl) {
      throw new Error('Unable to initialize WebGL. Your browser may not support it.');
    }

    this.gl = gl;

    gl.effectManager = new AssetManager(Effect, gl);
    gl.textureManager = new AssetManager(ImageTexture, gl);

    gl.matrixStack = new MatrixStack();
    gl.painter2d = new BatchDraw2D(gl);
  }
}

@nativeComponent('GLSurface')
export default class GLSurfaceManager extends BaseViewManager {
  canvasInstanceRegistry = [];

  createView() {
    const div = document.createElement('div');
    div.style.display = 'flex';
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    div.appendChild(canvas);
    return div;
  }

  setViewTag(view, tag) {
    super.setViewTag(view, tag);
    this.canvasInstanceRegistry[tag] = new GLSurfaceAgent(this.bridge, view.firstChild, tag);
  }

  @domStyle
  flex;

  @domStyle
  position;

  @directEvent
  onSurfaceCreated;

  @directEvent
  onSizeChanged;

  setChildren(view, children) {
    const tag = view.getAttribute('data-react-id') | 0;
    const agent = this.canvasInstanceRegistry[tag];
    agent.layers = children;
  }
}
