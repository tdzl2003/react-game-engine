/**
 * Created by tdzl2003 on 04/06/2017.
 */

import {
  requireNativeComponent
} from 'react-native';
import {
  PropTypes
} from 'React';

export const GLLayer2D = requireNativeComponent('GLLayer2D', {
  propTypes: {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }
});

export const GLSurface = requireNativeComponent('GLSurface', {
  propTypes: {
    onSurfaceCreated: PropTypes.func,
    onSizeChanged: PropTypes.func,
  },
});

