/**
 * Created by tdzl2003 on 30/05/2017.
 */

global.__ASSET_ROOT__ = '../..';

const { Bridge } = require('react-game-engine-launcher');

const bridge = new Bridge(
  __DEV__ ?
    './index.bundle?platform=web' :
    './index.bundle.js'
);


bridge.start();

bridge.createRootView(document.body, 'game');
