/**
 * Created by tdzl2003 on 03/06/2017.
 */

export default class BaseViewManager {
  setViewTag(view, tag) {
    view.setAttribute('data-react-id', tag);
  }

  setChildren(view, children) {
    // TODO: Optimize me.
    while (view.lastChild) {
      view.removeChild(view.lastChild);
    }

    for (const child of children) {
      view.appendChild(child);
    }
  }

  setViewProps(view, props) {
    for (const key of Object.keys(props)) {
      if (this.__styles[key]) {
        this.__styles[key](view, props[key]);
      }
    }
  }
}
