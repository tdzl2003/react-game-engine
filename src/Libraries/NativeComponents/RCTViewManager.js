/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { nativeComponent } from './decorators';
import BaseViewManager from './BaseViewManager';

@nativeComponent('RCTView')
export default class RCTViewManager extends BaseViewManager {
  createView() {
    return document.createElement('div');
  }


}
