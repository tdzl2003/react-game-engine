/**
 * Created by tdzl2003 on 30/05/2017.
 */

import React, { Component } from 'react';
import {
  GLSurface,
} from 'renal';
import {
  View,
  StyleSheet,
  AppRegistry,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Game extends Component {
  onSurfaceCreated = (ev) => {
    console.log('onSurfaceCreated: ', ev.nativeEvent);
  };
  onSizeChanged = (ev) => {
    console.log('onSizeChanged: ', ev.nativeEvent);
  };
  render() {
    return (
      <GLSurface
        style={styles.container}
        onSurfaceCreated = {this.onSurfaceCreated}
        onSizeChanged = {this.onSizeChanged}
      >
      </GLSurface>
    );
  }
}

AppRegistry.registerComponent('game', () => Game);
