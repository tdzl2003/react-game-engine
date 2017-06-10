/**
 * Created by tdzl2003 on 30/05/2017.
 */

import { Bridge } from 'react-game-engine-launcher';

const bridge = new Bridge(
  __DEV__ ?
  './index.bundle?platform=web' :
  './index.bundle.js'
);

global.__ASSERT_ROOT__ = '../..';

bridge.start();

bridge.createRootView(document.body, 'game');
