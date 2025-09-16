# Warn

- 如果开发中, 发现接口无法访问, 并且插件中没有日志, 那记得改下package中的name, 并重新启动插件,配置rule;
- 优先用 npm 安装的 whistle 去调试, 看log 比较方便, client 某些情况下, 不出log;
- 数据文件在用户目录下: .WhistleAppData
- 自定义证书需要通过 p12 文件生成 crt 文件和 key 文件: 然后重命名为 root.crt 和 root.key, 放到.WhistleAppData\custom_certs


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
 * 
 * 如果 onRequest 返回 `false` 表示不再把请求透传给源服务，这个时候可以使用 `ctx.writeHead`/`ctx.end` 异步输出想要的响应内容
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
exports.onRequest = async (ctx) => {
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
exports.onResponse = async (ctx) => {
  console.log("response: ", ctx.method, ctx.fullUrl);
}
```
