/**
 * Created by tdzl2003 on 30/05/2017.
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-game-engine';
import {
  View,
  StyleSheet,
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
      <View style={styles.container}>
        <View style={styles.blue}>
        </View>
        <View style={styles.red}>
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('game', () => Game);
