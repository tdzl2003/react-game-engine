/**
 * Created by tdzl2003 on 30/05/2017.
 */

import React, { Component } from 'react';
import {
  GLSurface,
  GLLayer2D,
  GLRect2D,
  GLImage,
  GLBasicSprite,
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
class Chicken extends Component {

  static animationData = [
    [0,1,2,1],
    [3,4,5,4],
    [9,10,11,10],
    [6,7,8,7],
  ];

  @observable
  direction = 0;

  render() {
    return (
      <GLBasicSprite
        source={require('./chicken.png')}
        animationData={Chicken.animationData[this.direction]}
        columns={3}
        tileW={0.25}
        tileH={0.25}
        interval={120}
      />
    );
  }
}

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
    this.chicken.direction = (this.chicken.direction + 1) % 4;
  };
  onChickenRef = ref => {
    this.chicken = ref;
  };
  render() {
    return (
      <View style={styles.container}>
        <GLSurface
          style={styles.container}
          onSurfaceCreated = {this.onSurfaceCreated}
          onSizeChanged = {this.onSizeChanged}
        >
          <GLLayer2D>
            <Chicken ref={this.onChickenRef}/>
          </GLLayer2D>
        </GLSurface>
        <View style={styles.buttonList}>
          <Button title="Press Me." onPress={this.onPress} />
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('game', () => Game);
