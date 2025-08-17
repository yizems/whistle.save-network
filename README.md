# whistle.middleware

## 安装

```
npm install whistle.middleware --registry=https://registry.npmmirror.com
```

## 使用

```bash
# 规则
pattern middleware://D:\temporary\test.js

pattern middleware://test.js # 这里需要在插件选项里设置根目录为
pattern middleware://test.js?p1=v1&p2=v2 # 可以通过 ? 传递参数，使用 ctx.utils.params 读取
```

文件 **test.js**:
```javascript

/**
 * 请求拦截
 * @param {{ 
 *      method: string, 
 *      url: URL | null, 
 *      fullUrl: string, 
 *      w2Response: any,
 *      requestType: string, 
 *      requestHeaders: Record<string, string>, 
 *      requestRawBody: Buffer | null, 
 *      requestBody: unknown, 
 *      json: (data: unknown) => void, // 调用该函数可以直接返回指定内容，不再执行后续请求
 *      utils: {
 *          params: Record<string, string> // ? 传递的中参数
 *          stringifyBuffer: (buf?: unknown) => string
 *          fetch: Fetch
 *      }
 *    }} ctx
 */
exports.onRequest = (ctx) => {
  console.log("request: ", ctx.method, ctx.fullUrl);
}

/**
 * 响应拦截
 * @param {{ 
 *      method: string, 
 *      url: URL | null, 
 *      fullUrl: string, 
 *      w2Response: any,
 *      requestType: string, 
 *      requestHeaders: Record<string, string>, 
 *      requestRawBody: Buffer | null, 
 *      requestBody: unknown, 
 *      responseType: string, 
 *      responseRawBody: Buffer | null, 
 *      responseBody: unknown, 
 *      responseHeaders: Record<string, string> | null, 
 *      json: (data: unknown) => void, // 调用该函数可以修改响应内容
 *      utils: {
 *          params: Record<string, string> // ? 传递的中参数
 *          stringifyBuffer: (buf?: unknown) => string
 *          fetch: Fetch
 *      }
 *    }} ctx
 */
exports.onResponse = (ctx) => {
  console.log("response: ", ctx.method, ctx.fullUrl);
}
```