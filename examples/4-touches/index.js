/**
 * Created by tdzl2003 on 30/05/2017.
 */

import React, { Component } from 'react';
import {
  GLSurface,
  GLLayer2D,
  GLNode2D,
  GLBasicSprite,
} from 'renal';
import {
  View,
  StyleSheet,
  AppRegistry,
  Button,
  Animated,
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

const AnimatedNode = Animated.createAnimatedComponent(GLNode2D);

@observer
class Game extends Component {
  @observable
  surfaceInfo = {
    width: 0,
    height: 0,
    ratio: 1,
  };

  x = new Animated.Value(0);
  y = new Animated.Value(0);

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
    const toValueX = (Math.random() - 0.5) * this.surfaceInfo.width;
    const toValueY = (Math.random() - 0.5) * this.surfaceInfo.height;
    const useNativeDriver = false;
    Animated.spring(this.x, { toValue:toValueX, useNativeDriver }).start();
    Animated.spring(this.y, { toValue:toValueY, useNativeDriver }).start();
  };
  onChickenRef = ref => {
    this.chicken = ref;
  };
  onStartShouldSetResponder = () => {
    return true;
  };
  onResponderMove = ev => {
    this.x.setValue(ev.nativeEvent.pageX - this.surfaceInfo.width / 2);
    this.y.setValue(ev.nativeEvent.pageY - this.surfaceInfo.height / 2);
  };
  render() {
    const { width, height } = this.surfaceInfo;

    return (
      <View
        style={styles.container}
        onStartShouldSetResponder={this.onStartShouldSetResponder}
        onResponderGrant={this.onResponderMove}
        onResponderMove={this.onResponderMove}
      >
        <GLSurface
          style={styles.container}
          onSurfaceCreated = {this.onSurfaceCreated}
          onSizeChanged = {this.onSizeChanged}
        >
          <GLLayer2D width={width} height={height} >
            <AnimatedNode scaleX={32} scaleY={32} x={this.x} y={this.y}>
              <Chicken ref={this.onChickenRef}/>
            </AnimatedNode>
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
