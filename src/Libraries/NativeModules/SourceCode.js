/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { reactMethod, reactPromiseMethod, reactModule } from './decorators';

@reactModule
export default class SourceCode {
  constructor(bridge) {
    this.constants = {
      scriptURL: bridge.bundleUrl,
    };
  }
}

