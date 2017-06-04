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

class Game extends Component {
  onSurfaceCreated = (ev) => {
    console.log('onSurfaceCreated: ', ev.nativeEvent);
  };
  onSizeChanged = (ev) => {
    console.log('onSizeChanged: ', ev.nativeEvent);
  };
  onPress = (ev) => {
    console.log('onPressed');
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
