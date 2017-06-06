/**
 * Created by tdzl2003 on 2017/3/19.
 */

export class AssetType {
  ref = 0;

  loaded = false;
  willLoaded = false;

  gl;
  key;

  constructor(key) {
    this.key = key;
  }

  // return a promise if assets needs a async loading.
  load(gl) {
    this.willLoaded = true;
    return Promise.resolve(this.doLoad(gl))
      .then( v=> {
        this.loaded = true;
        console.log('Loaded: ', this.key);
        if (!this.willLoaded) {
          this.unload();
        }
      })
  }

  unload(gl) {
    this.loaded = false;
    this.willLoaded = false;
  }

  addRef() {
    ++this.ref;
  }

  release() {
    if (--this.ref === 0) {
      this.unload();
    }
  }

  destroy() {
  }
}

export default class AssetManager {
  clazz = null;
  assets = []

  constructor(clazz, gl) {
    this.clazz = clazz;
    this.gl = gl;
  }
  
  __obtainFromRequireInNative(key) {
    if (typeof(key) === 'object') {
      key = (key.httpServerLocation || key.fileSystemLocation) + '/' + key.name + '.' + key.type;
    }
    return this.obtain(key);
  }

  obtain(key) {
    let ref = this.assets[key];
    if (!ref) {
      this.assets[key] = ref = new this.clazz(key);
      ref.load(this.gl);
    }

    ref.addRef();
    return ref;
  }
}
