/**
 * Created by tdzl2003 on 04/06/2017.
 */

import {
  requireNativeComponent
} from 'react-native';
import {
  PropTypes
} from 'React';

const GLSurface = requireNativeComponent('GLSurface', {
  propTypes: {
    onSurfaceCreated: PropTypes.func,
    onSizeChanged: PropTypes.func,
  },
});

export default GLSurface;
