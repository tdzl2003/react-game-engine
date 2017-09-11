'use strict';

var path = require('path');
var blacklist = require('./node_modules/react-native/packager/blacklist');

var config = {
  getProjectRoots() {
    return getRoots();
  },

  getBlacklistRE() {
    return blacklist([
      /\.idea[\/\\].*/,
    ]);
  },

  getAssetExts() {
    return ['effect'];
  },

  getPlatforms() {
    return ['web'];
  },

  extraNodeModules: {
    'renal': __dirname,
  },

  getProvidesModuleNodeModules() {
    return [
      'react-native',
      'react-native-windows',
      'react-native-web-platform',
    ];
  },
};

function getRoots() {
  var root = process.env.REACT_NATIVE_APP_ROOT;
  if (root) {
    return [path.resolve(root)];
  }
  return [__dirname];
}

module.exports = config;
