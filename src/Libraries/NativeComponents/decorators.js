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

export function style(target, name, args) {
  const setter = args.value;

  if (target.hasOwnProperty('__styles')){
    target.__styles[name] = setter;
  } else {
    Object.defineProperty(target, '__styles', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: setter,
      },
    })
  }
}


export function domStyle(target, name, args) {
  const setter = (view, value) => {
    view.style[name] = value;
  };

  if (target.hasOwnProperty('__styles')){
    target.__styles[name] = setter;
  } else {
    Object.defineProperty(target, '__styles', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: setter,
      },
    })
  }
}
