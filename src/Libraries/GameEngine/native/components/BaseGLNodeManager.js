/**
 * Created by tdzl2003 on 03/06/2017.
 */

export class GLBaseNode {
  tag;

  renderGL(gl) {

  }
}

export class GLContainer extends GLBaseNode {
  children;

  renderGL(gl) {
    if (this.children) {
      for (const child of this.children) {
        child.renderGL(gl);
      }
    }
  }
}

export default function BaseGLNodeManager(clazz) {
  return class BaseGLNodeManager {
    constructor(bridge) {
      console.log(clazz);
      this.bridge = bridge;
      this.__props = {
        ...this.__props,
        ...clazz.prototype.__props
      };
      this.__nativeProps = {
        ...this.__nativeProps,
        ...clazz.prototype.__nativeProps
      };
    }

    createView() {
      return new clazz();
    }

    setViewTag(view, tag) {
      view.tag = tag;
    }

    setChildren(view, children) {
      view.children = children;
    }

    setViewProps(view, props) {
      for (const key of Object.keys(props)) {
        if (this.__styles && this.__styles[key]) {
          this.__styles[key](view, props[key]);
        } else if (this.__props && this.__props[key]) {
          this.__props[key](view, props[key]);
        }
      }
    }
  }
}
