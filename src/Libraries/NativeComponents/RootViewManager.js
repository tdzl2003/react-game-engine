/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { nativeComponent } from './decorators';
import BaseViewManager from './BaseViewManager';

export default class RootViewManager extends BaseViewManager {
  createView() {
    return document.createElement('div');
  }

  setViewTag(view, tag) {
    super.setViewTag(view, tag);
    view.setAttribute('data-react-root', tag);
  }
}
