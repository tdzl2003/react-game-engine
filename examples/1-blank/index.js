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
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blue: {
    flex: 1,
    backgroundColor: 'blue',
  },
  red: {
    flex: 1,
    backgroundColor: 'red',
  },
});

class Game extends Component {
  render() {
    return (
      <GLSurface style={styles.container}>
      </GLSurface>
    );
  }
}

AppRegistry.registerComponent('game', () => Game);
