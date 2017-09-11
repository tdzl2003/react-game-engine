/**
 * Created by tdzl2003 on 30/05/2017.
 */

global.__ASSET_ROOT__ = '../..';

require('es6-promise').polyfill();
require('isomorphic-fetch');
require('renal/native');
const { Bridge } = require('react-native-web-platform/lib/launch');

const bridge = new Bridge(
  __DEV__ ?
    './index.bundle?platform=web' :
    './index.bundle.js'
);


bridge.start();

bridge.createRootView(document.body, 'game');
