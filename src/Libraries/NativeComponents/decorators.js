/**
 * Created by tdzl2003 on 03/06/2017.
 */

export const nativeComponentClasses = [];

export function nativeComponent(name) {
  if (typeof(name) === 'function') {
    name.__nativeComponentName = name.__nativeComponentName || name.name;
    nativeComponentClasses.push(name);
    return;
  }
  return function (target) {
    target.__nativeComponentName = name;
    nativeComponentClasses.push(target);
  }
}
