/**
 * Created by tdzl2003 on 30/05/2017.
 */

import { Bridge } from 'react-game-engine-launcher';

const bridge = new Bridge('./index.bundle.js?platform=web');

bridge.start();

bridge.createRootView(document.body, 'game');
