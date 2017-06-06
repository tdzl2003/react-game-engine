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
import resolveAssetSource from 'resolveAssetSource';

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
  static defaultProps = {
    x: -0.5,
    y: -0.5,
    w: 1,
    h: 1,
    color: 'white',
  };
  render() {
    const {x, y, w, h, color} = this.props;
    return <NativeGLRect2D x={x} y={y} w={w} h={h} color={normalizeColor(color)}/>;
  }
}

const NativeGLRect2D = requireNativeComponent('GLRect2D', GLRect2D);

export class GLImage extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    h: PropTypes.number,
    tx: PropTypes.number,
    ty: PropTypes.number,
    tw: PropTypes.number,
    th: PropTypes.number,
    color: ColorPropType,
    source: PropTypes.oneOfType([
      PropTypes.shape({
        uri: PropTypes.string,
      }),
      // Opaque type returned by require('./image.jpg')
      PropTypes.number,
    ]),
  };
  static defaultProps = {
    x: -0.5,
    y: -0.5,
    w: 1,
    h: 1,
    tx: 0,
    ty: 0,
    tw: 1,
    th: 1,
    color: 'white',
  };
  render() {
    const {x, y, w, h, tx, ty, tw, th, source, color} = this.props;

    let resolvedSource = source && resolveAssetSource(source);

    console.log(source, resolvedSource);

    return (
      <NativeGLImage
        x={x} y={y} w={w} h={h} color={normalizeColor(color)}
        tx={tx} ty={ty} tw={tw} th={th} src={resolvedSource && resolvedSource.uri}
      />
    );
  }
}

const NativeGLImage = requireNativeComponent('GLImage', GLImage, {
  nativeOnly: {
    src: PropTypes.string,
  }
});


export const GLSurface = requireNativeComponent('GLSurface', {
  propTypes: {
    onSurfaceCreated: PropTypes.func,
    onSizeChanged: PropTypes.func,
  },
});

