import { reactPromiseMethod, reactModule } from './decorators';

import _ from 'lodash';

const mergeLocalStorageItem = (key, value) => {
  const oldValue = window.localStorage.getItem(key);
  const oldObject = JSON.parse(oldValue);
  const newObject = JSON.parse(value);
  const nextValue = JSON.stringify(_.merge({}, oldObject, newObject));
  window.localStorage.setItem(key, nextValue);
};

const createPromise = (getValue, callback) => {
  return new Promise((resolve, reject) => {
    try {
      const value = getValue();
      if (callback) {
        callback(null, value);
      }
      resolve(value);
    } catch (err) {
      if (callback) {
        callback(err);
      }
      reject(err);
    }
  });
};

const createPromiseAll = (promises, callback, processResult) => {
  return Promise.all(promises).then(
    result => {
      const value = processResult ? processResult(result) : null;
      callback && callback(null, value);
      return Promise.resolve(value);
    },
    errors => {
      callback && callback(errors);
      return Promise.reject(errors);
    }
  );
};

@reactModule('AsyncLocalStorage')
export default class AsyncLocalStorage {
  @reactPromiseMethod
  clear(callback) {
    return createPromise(() => {
      window.localStorage.clear();
    }, callback);
  }

  @reactPromiseMethod
  getAllKeys(callback) {
    return createPromise(() => {
      const numberOfKeys = window.localStorage.length;
      const keys = [];
      for (let i = 0; i < numberOfKeys; i += 1) {
        const key = window.localStorage.key(i);
        keys.push(key);
      }
      return keys;
    }, callback);
  }

  @reactPromiseMethod
  getItem(key, callback) {
    return createPromise(() => {
      return window.localStorage.getItem(key);
    }, callback);
  }

  @reactPromiseMethod
  multiGet(keys, callback) {
    const promises = keys.map(key => this.getItem(key));
    const processResult = result => result.map((value, i) => [keys[i], value]);
    return createPromiseAll(promises, callback, processResult);
  }

  @reactPromiseMethod
  setItem(key, value, callback) {
    return createPromise(() => {
      window.localStorage.setItem(key, value);
    }, callback);
  }

  @reactPromiseMethod
  multiSet(keyValuePairs, callback) {
    const promises = keyValuePairs.map(item => this.setItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  }

  @reactPromiseMethod
  mergeItem(key, value, callback) {
    return createPromise(() => {
      mergeLocalStorageItem(key, value);
    }, callback);
  }

  @reactPromiseMethod
  multiMerge(keyValuePairs, callback) {
    const promises = keyValuePairs.map(item => this.mergeItem(item[0], item[1]));
    return createPromiseAll(promises, callback);
  }

  @reactPromiseMethod
  removeItem(key, callback) {
    return createPromise(() => {
      return window.localStorage.removeItem(key);
    }, callback);
  }

  @reactPromiseMethod
  multiRemove(keys, callback) {
    const promises = keys.map(key => this.removeItem(key));
    return createPromiseAll(promises, callback);
  }
};

module.exports = AsyncLocalStorage;