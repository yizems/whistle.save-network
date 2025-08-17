import { fetch } from "undici";
import { parseBodyByType } from "./library/parseBodyByType";
import { executeMiddleware } from "./library/executeMiddleware";
import { stringifyBuffer } from "./library/stringifyBuffer";

export default (server: Whistle.PluginServer, options: Whistle.PluginOptions) => {
  // handle http request
  server.on('request', (req: Whistle.PluginServerRequest, res: Whistle.PluginServerResponse) => {
    const ruleValue = req.originalReq.ruleValue;
    const baseDir = req.localStorage.getProperty("middlewareBaseDir");
    const findModule = ruleValue ? executeMiddleware(baseDir, ruleValue) : null;
    if (!findModule) {
      req.passThrough();
      return;
    }
    const { onRequest, onResponse } = findModule.middleware;
    const ctx: ScriptRunContext = {
      request: req,
      w2Response: res,
      method: (req.method || "GET").toUpperCase(),
      url: new URL(req.originalReq.fullUrl),
      fullUrl: req.originalReq.fullUrl,
      requestType: req.headers["content-type"],
      requestHeaders: req.headers as Record<string, string>,
      requestRawBody: null,
      requestBody: null,

      response: null,
      responseType: "",
      responseRawBody: null,
      responseBody: null,
      responseHeaders: null,

      json: () => { console.log("NOT SUPPORT.") },
      utils: {
        stringifyBuffer: stringifyBuffer,
        fetch: fetch,
        params: findModule.params,
        sleep: (ts: number) => new Promise((resolve) => setTimeout(resolve, ts)),
      }
    };
    req.passThrough((raw, next, req) => {
      ctx.requestRawBody = raw ?? null;
      ctx.requestBody = parseBodyByType(ctx.requestType, raw);

      if (typeof onRequest === "function") {
        let breakNext = false;
        ctx.json = (data: unknown) => {
          if (breakNext) { return; }
          res.writeHead(200, { "content-type": "application/json;charset=utf-8", });
          res.end(data ? JSON.stringify(data) : "");
          breakNext = true;
        };
        const result: Whistle.PluginNextResult | false = onRequest({ ...ctx });
        if (result === false || breakNext) {
          return;
        }
        next(result);
        breakNext = true;
      } else {
        next();
      }
    }, (raw, next, _res) => {
      _res.getBuffer((err, buf) => {
        if (typeof onResponse === "function") {
          let breakNext = false;
          ctx.response = _res;
          ctx.responseType = _res.headers["content-type"] || "";
          ctx.responseRawBody = buf;
          ctx.responseHeaders = _res.headers as Record<string, string>;
          ctx.responseBody = parseBodyByType(ctx.responseType, buf);
          ctx.json = (data: unknown) => {
            if (breakNext) {
              console.warn(`json called after breakNext`);
              return;
            }
            breakNext = true;
            if (data === null || data === undefined) {
              next();
            } else {
              next({ body: JSON.stringify(data) });
            }
          };

          try {
            Promise.resolve(onResponse({ ...ctx }))
              .catch((ex: unknown) => {
                console.warn("onResponse error: ", ex);
                return null;
              }).then((result: Whistle.PluginNextResult | null) => {
                if (breakNext) {
                  return;
                }
                next(result);
                breakNext = true;
              });
          } catch (ex) {
            console.warn("onResponse exception: ", ex);
            next();
          }
        } else {
          next();
        }
      });
    });
  });

  // handle websocket request
  server.on('upgrade', (req: Whistle.PluginServerRequest, socket: Whistle.PluginServerSocket) => {
    // do something
    req.passThrough();
  });

  // handle tunnel request
  server.on('connect', (req: Whistle.PluginServerRequest, socket: Whistle.PluginServerSocket) => {
    // do something
    req.passThrough();
  });
};

type ScriptRunContext = {
  // 请求
  request: Whistle.PluginServerRequest
  w2Response: Whistle.PluginServerResponse
  method: string
  url: URL | null,
  fullUrl: string
  requestType: string
  requestHeaders: Record<string, string>
  requestRawBody: Buffer | null
  requestBody: unknown

  // 响应
  response: Whistle.PluginResCtx | null
  responseType: string
  responseRawBody: Buffer | null
  responseBody: unknown
  responseHeaders: Record<string, string> | null

  json: (data: unknown) => void

  // 工具函数
  utils: {
    params: Record<string, string>
    stringifyBuffer: (buf?: unknown) => string
    fetch: typeof fetch
    sleep: (ts: number) => Promise<void>
  }
  // nextRequest: (data?: Whistle.PluginNextResult) => void
}