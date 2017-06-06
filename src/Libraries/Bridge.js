/**
 * Created by tdzl2003 on 03/06/2017.
 */
import { moduleClasses } from './NativeModules/decorators';

const BRIDGE_CODE = `
var Status = undefined;

var process = {
  env: {
    NODE_ENV: '${__DEV__ ? 'development' : 'production'}',
  },
};

var originGlobals = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
};

onmessage = function(e) {
  var msg = e.data;
  if (!msg || !msg.cmd) {
    return;
  }
  if (msg.cmd === 'moduleConfig' ) {
    __fbBatchedBridgeConfig = msg.moduleConfig;
    Status = 'moduleConfig';
  } else
  if (msg.cmd === 'bundle' && Status === 'moduleConfig') {
    try {
      importScripts(msg.bundleName);
      Status = 'bundle';
    } catch (e) {
      console.warn(e.stack);
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", msg.bundleName, true);
      xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4) {
          var result = JSON.parse(xmlhttp.responseText);
          if (result) {
            if (result.type === 'UnableToResolveError' || result.type === 'NotFoundError') {
              console.warn(result.message);
            } else {
              if (result.snippet) {
                // remove all color characters and split the lines for improved clarity
                result.snippet = result.snippet.replace(/\\u001b\\[.*?m/g, '').split('\\n');
              }
              if (result.filename && result.filename.indexOf(':') <= 2) {
                result.filename = 'file:///' + result.filename;
              }
              if (result.errors) {
                for (var i=0; i<result.errors.length; i++) {
                  var error = result.errors[i];
                  if (error.filename && error.filename.indexOf(':') <= 2) {
                    error.filename = 'file:///' + error.filename;
                  }
                }
              }
              console.warn(JSON.stringify(result, undefined, 2));
            }
          }
        }
      }
      xmlhttp.send(null);
    }
  } else if (Status === 'bundle') {
    var results;
    if (msg.cmd === 'exec') {
      results = __fbBatchedBridge.callFunctionReturnFlushedQueue.apply(null, [msg.module, msg.func, msg.args]);
    } else
    if (msg.cmd === 'invoke') {
      results = __fbBatchedBridge.invokeCallbackAndReturnFlushedQueue.apply(null, [msg.id, msg.args]);
    } else
    if (msg.cmd === 'flush') {
      results = __fbBatchedBridge.flushedQueue.apply(null);
    }
    if (results) {
      try {
        postMessage({cmd: 'exec', results: results});
      } catch (e) {
        console.warn(e);
        console.warn(msg);
        console.warn(JSON.stringify(results))
      }
    }
  }
}
`;

function bundleFromRoot(root) {
  let path = location.pathname;
  if (!path.endsWith('/')) {
    // Trim filename
    path = path.substr(0, path.lastIndexOf('/'));
  } else {
    path = path.substr(0, path.length - 1);
  }
  return location.protocol + '//' + location.host + path + '/' + root;
}

export default class Bridge {
  constructor(bundleUrl) {
    this.bundleUrl = bundleFromRoot(bundleUrl);
    this.moduleInstances = moduleClasses.map(v => new v(this));
    this.moduleConfig = {
      remoteModuleConfig: this.moduleInstances.map(this.createModuleConfig),
    };
  }

  createModuleConfig = (instance) => {
    return [
      instance.constructor.__reactModuleName || instance.constructor.name,
      instance.constants || null,
      instance.__methods || [],
      instance.__promiseMethods || [],
      instance.__syncMethods || [],
    ]
  };

  start() {
    if (global.Worker) {
      const bridgeCodeBlob = new Blob([BRIDGE_CODE]);
      const w = this.worker = new Worker(URL.createObjectURL(bridgeCodeBlob));
      w.postMessage({
        cmd: 'moduleConfig',
        moduleConfig: this.moduleConfig,
      });
      w.postMessage({
        cmd: 'bundle',
        bundleName: this.bundleUrl
      });
      w.onmessage = this.onMessage.bind(this);
    } else {
      // TODO: Implement without worker.
      throw new Error('ReactGameEngine without Worker is not implemented yet.');
    }
  }

  onMessage(e) {
    const msg = e.data;
    if (msg.cmd === 'exec') {
      const [ moduleIds, methodIds, args ] = msg.results;
      for (let i = 0; i < moduleIds.length; i++) {
        const module = this.moduleInstances[moduleIds[i]];
        const methodName = module.__methods[methodIds[i]];

        module[methodName].apply(module, args[i]);
      }
    }
  }

  createRootView(container, appKey, initialProps = null) {
    const rootTag = this.uiManager.createRootView(container);
    this.exec('AppRegistry', 'runApplication', [
      appKey,
      {
        rootTag,
        initialProps,
      },
    ]);
    return () => {
      // TODO: dispose rootView.
    };
  }

  exec(module, func, args) {
    if (this.worker) {
      this.worker.postMessage({
        cmd: 'exec',
        module, func, args
      })
    } else {
      // TODO: Implement without worker.
    }
  }

  sendEvent(tag, type, nativeEvent) {
    this.exec('RCTEventEmitter', 'receiveEvent', [tag, type, nativeEvent]);
  }
}
