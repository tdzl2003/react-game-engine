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
      this.bridge = bridge;

      this.__props = Object.assign(this.__props || {}, clazz.prototype.__props);
      this.__nativeProps = Object.assign(this.__nativeProps || {}, clazz.prototype.__nativeProps);
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

    manageChildren(view, moveFrom, moveTo, addChildren, addAtIndecies, removeFrom) {
      const startChildren = [...view.children];

      const finallyRemoves = [];

      if (moveFrom) {
        addChildren = addChildren || [];
        addAtIndecies = addAtIndecies || [];
        for (let i = 0; i < moveFrom.length; i++) {
          const viewToMove = startChildren[moveFrom[i]];
          startChildren[i] = null;
          addChildren.append(viewToMove);
          addAtIndecies.append(moveTo[i]);
        }
      }

      if (removeFrom) {
        for (const i of removeFrom) {
          const viewToRemove = startChildren[i];
          startChildren[i] = null;
          finallyRemoves.push(viewToRemove.tag | 0);
        }
      }

      if (addAtIndecies) {
        const finalChildren = [];

        // Use different algorithm to avoid sort.
        for (let i = 0; i < addAtIndecies.length; i++) {
          const child = addChildren[i];
          const targetId = addAtIndecies[i];  // i views already inserted before.
          finalChildren[targetId] = child;
        }

        let idx = 0;

        for (const view of startChildren.filter(v => v)) {
          while (finalChildren[idx]) {
            idx ++;
          }
          finalChildren[idx] = view;
        }
        view.children = finalChildren;
      } else {
        view.children = startChildren.filter(v => v);
      }
      return finallyRemoves;
    }

    beforeRemoveView(view) {

    }
  }
}
