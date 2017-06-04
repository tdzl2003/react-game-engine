/**
 * Created by tdzl2003 on 04/06/2017.
 */

import {
  requireNativeComponent
} from 'react-native';
import React, {
  Component,
  PropTypes,
} from 'React';
import ColorPropType from 'ColorPropType';
import normalizeColor from 'normalizeColor';


export const GLLayer2D = requireNativeComponent('GLLayer2D', {
  propTypes: {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }
});

export const GLNode2D = requireNativeComponent('GLNode2D', {
  propTypes: {
    x: PropTypes.number,
    y: PropTypes.number,
    rotate: PropTypes.number,
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
  }
});

export class GLRect2D extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    h: PropTypes.number,
    color: ColorPropType,
  };
  render() {
    const {x, y, w, h, color} = this.props;
    return <NativeGLRect2D x={x} y={y} w={w} h={h} color={normalizeColor(color)}/>;
  }
}

const NativeGLRect2D = requireNativeComponent('GLRect2D', GLRect2D);

export const GLSurface = requireNativeComponent('GLSurface', {
  propTypes: {
    onSurfaceCreated: PropTypes.func,
    onSizeChanged: PropTypes.func,
  },
});

