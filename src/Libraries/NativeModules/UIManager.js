/**
 * Created by tdzl2003 on 03/06/2017.
 */

import { reactMethod, reactPromiseMethod, reactModule } from './decorators';
import { nativeComponentClasses } from '../NativeComponents/decorators';
import RootViewManager from "../NativeComponents/RootViewManager";

const DEBUG = __DEV__;

const ROOT_VIEW_TAG_INCREMENT = 10;

@reactModule
export default class UIManager {

  viewRegistry = [];
  viewCounter = 0;

  nextRootViewTag = 1;

  viewManagers = {};

  rootViewManager = new RootViewManager();

  constructor(bridge) {
    bridge.uiManager = this;

    const nativeComponentsInfo = {};

    nativeComponentClasses.forEach(clazz => {
      const name = clazz.__nativeComponentName;
      this.viewManagers[name] = new clazz();
      nativeComponentsInfo[name] = {
        NativeProps: {},
      }
    });

    this.constants = nativeComponentsInfo;
  }

  registerRootView(rootView) {
    const tag = this.nextRootViewTag;
    this.nextRootViewTag += ROOT_VIEW_TAG_INCREMENT;
    this.viewRegistry[tag] = [rootView, this.rootViewManager];
    rootView.setAttribute('data-react-id', tag);
    rootView.setAttribute('data-react-root', true);
    return tag;
  }

  createRootView(container) {
    const view = this.rootViewManager.createView();
    const tag = this.nextRootViewTag;
    this.nextRootViewTag += ROOT_VIEW_TAG_INCREMENT;
    this.viewRegistry[tag] = [view, this.rootViewManager];
    container.appendChild(view);
    return tag;
  }

  @reactMethod
  createView(tag, className, rootViewTag, props) {
    if (DEBUG) {
      console.log('createView', tag, className, rootViewTag, props);
    }
    const manager = this.viewManagers[className];
    const view = manager.createView();
    manager.setViewTag(view, tag);
    this.viewRegistry[tag] = [
      view,
      manager,
    ];
  }

  @reactMethod
  setChildren(viewTag, childrenTags) {
    if (DEBUG) {
      console.log('setChildren', viewTag, childrenTags);
    }
    const [ view, manager ] = this.viewRegistry[viewTag];

    manager.setChildren(view, childrenTags.map(tag=>this.viewRegistry[tag][0]));
  }
}
