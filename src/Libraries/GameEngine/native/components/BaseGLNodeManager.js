/**
 * Created by tdzl2003 on 03/06/2017.
 */

export class GLNode {
  tag;

  renderGL(gl) {

  }
}

export class GLContainer extends GLNode {
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
      this.__props = clazz.prototype.__props;
      this.__nativeProps = clazz.prototype.__nativeProps;
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
    }
  }
}
