import vm from 'vm';
import fs from "fs";
import path from "path";
import { isJson } from './utils';
import { parseJson } from './parseJson';

const GLOBAL_VARS = [
  'process',
  'Buffer',
  'clearImmediate',
  'clearInterval',
  'clearTimeout',
  'setImmediate',
  'setInterval',
  'setTimeout',
  'console',
  'module',
  'require',
];
const TIMEOUT = 600;
const VM_OPTIONS = {
  displayErrors: false,
  timeout: TIMEOUT,
};
let CONTEXT = vm.createContext();

setInterval(() => {
  CONTEXT = vm.createContext();
}, 30000);

function getScript(code: string, name: string) {
  code = code && code.trim();
  if (!code) {
    return;
  }
  code = `const d = require('domain').create();
          d.on('error', console.error);
          d.run(() => {
            ${code}
          });`;
  try {
    return new vm.Script(`(function(){\n${code}\n})()`, { filename: name });
  } catch (err) {
    console.error(err);
  }
};

function executeCode(code: string) {
  const script = getScript(code, "test");
  GLOBAL_VARS.forEach((key) => {
    // @ts-ignore
    CONTEXT[key] = global[key];
  });
  CONTEXT.require = require;
  CONTEXT.process = process;
  CONTEXT.exports = {};
  CONTEXT.module = { exports: CONTEXT.exports };
  try {
    script.runInContext(CONTEXT, VM_OPTIONS);
    return CONTEXT.module.exports || {};
  } catch (err) {
    console.error(err);
  } finally {
    Object.keys(CONTEXT).forEach((key) => {
      if (GLOBAL_VARS.indexOf(key) === -1) {
        delete CONTEXT[key];
      }
    });
  }
  return {};
}

export function executeMiddleware(baseDir: string, ruleValue: string) {
  const data = parseRules(ruleValue);
  if (!data) {
    return null;
  }

  const middlewareFile = baseDir && !path.isAbsolute(data.middleware) ? path.join(baseDir, data.middleware) : data.middleware;
  if (!fs.existsSync(middlewareFile)) {
    console.warn(`middleware ${middlewareFile} not found`);
    return null;
  }

  delete require.cache[require.resolve(middlewareFile)];
  return {
    middleware: require(middlewareFile),
    params: data.params
  };
};

/**
 * middleware://D:\\whistle\\middlewares\\hello.js?name=value&phones=1,2,3
 * middleware:///data/whistle/middlewares/riskValid.js?name=value&phones=1,2,3
 * middleware://({ middleware: string, params: Record<string, string> })
 */
export function parseRules(ruleValue: string): { middleware: string, params: Record<string, string> } | null {
  if (!ruleValue || ruleValue.length === 0) {
    return null;
  }

  try {
    if (isJson(ruleValue)) {
      return parseJson(ruleValue);
    }
    if (ruleValue.indexOf(".js?") !== -1) {
      const [middleware, params] = ruleValue.split(".js?");
      return {
        middleware: middleware + ".js",
        params: params ? Object.fromEntries(new URLSearchParams(params).entries()) : {},
      };
    }
    if (ruleValue.endsWith(".js")) {
      return {
        middleware: ruleValue,
        params: {}
      };
    }
    return null;
  } catch (ex) {
    console.info("parseRules ruleValue: ", ruleValue);
    console.warn("parseRules error: ", ex);
    return null;
  }
}