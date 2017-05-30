'use strict';

var path = require('path');
var blacklist = require('./node_modules/react-native/packager/blacklist');

var config = {
  getProjectRoots() {
    return getRoots();
  },

  getBlacklistRE() {
    return blacklist([
    ]);
  },

  getAssetExts() {
    return [];
  },

  getPlatforms() {
    return ['web'];
  },

  getProvidesModuleNodeModules() {
    return ['react-native', 'react-native-game-engine'];
  },
};

function getRoots() {
  var root = process.env.REACT_NATIVE_APP_ROOT;
  if (root) {
    return [path.resolve(root)];
  }
  return [path.resolve(__dirname, '..')];
}

module.exports = config;