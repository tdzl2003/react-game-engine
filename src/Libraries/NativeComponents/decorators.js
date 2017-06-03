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

export function nativeProp(target, name, args) {
  if (target.hasOwnProperty('__props')){
    target.__nativeProps[name] = true;
  } else {
    Object.defineProperty(target, '__nativeProps', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: true,
      },
    })
  }
}

export function directEvent(target, name, args) {
  nativeProp(target, name, args);

  if (target.hasOwnProperty('__customDirectEventTypes')){
    target.__customDirectEventTypes[name] = {
      registrationName: name
    };
  } else {
    Object.defineProperty(target, '__customDirectEventTypes', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: {
          registrationName: name
        },
      },
    })
  }
}

export function prop(target, name, args) {
  const setter = args.value;

  if (target.hasOwnProperty('__props')){
    target.__props[name] = setter;
  } else {
    Object.defineProperty(target, '__props', {
      configurable: true,
      enumerable: false,
      value: {
        [name]: setter,
      },
    })
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