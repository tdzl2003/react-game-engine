/**
 * Created by tdzl2003 on 30/05/2017.
 */

import React, { Component } from 'react';
import {
  GLSurface,
} from 'react-game-engine';
import {
  View,
  StyleSheet,
  AppRegistry,
  Button,
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonList: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
  }
});

@observer
class Game extends Component {
  @observable
  surfaceInfo = {
    width: 0,
    height: 0,
    ratio: 1,
  };

  onSurfaceCreated = (ev) => {
    this.onSizeChanged(ev);
  };
  onSizeChanged = (ev) => {
    const { width, height, ratio } = ev.nativeEvent;
    this.surfaceInfo.width = width;
    this.surfaceInfo.height = height;
    this.surfaceInfo.ratio = ratio;
  };
  onPress = (ev) => {
  };
  render() {
    return (
      <View style={styles.container}>
        <GLSurface
          style={styles.container}
          onSurfaceCreated = {this.onSurfaceCreated}
          onSizeChanged = {this.onSizeChanged}
        >
        </GLSurface>
        <View style={styles.buttonList}>
          <Button title="Press Me." onPress={this.onPress} />
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('game', () => Game);
