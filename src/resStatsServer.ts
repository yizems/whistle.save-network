
/**
 * 如果获取请求的响应状态码、响应头、响应内容等信息，而不对请求做任何操作，可以用 resStatsServer。
 */
export default (server: Whistle.PluginServer, options: Whistle.PluginOptions) => {
  server.on('request', (req: Whistle.PluginRequest) => {

    // console.log('Value:', originalReq.ruleValue);
    // console.log('URL:', originalReq.fullUrl);
    // console.log('Method:', originalReq.method);
    // console.log('Server IP', originalRes.serverIp);
    // console.log('Status Code:', originalRes.statusCode);
    // console.log('Response Headers:', originalReq.headers);
    // get session data
    // req.getSession((reqSession) => {
    //   if (!reqSession) {
    //     return;
    //   }
    //   if (!reqSession.res.base64) {
    //     return;
    //   }

    //   const mock = getResponseMockService(config);
    //   const data: MockSaveResponse = {
    //     request: {
    //       method: reqSession.req.method || "GET",
    //       fullUrl: req.fullUrl,
    //       headers: req.headers as Record<string, string>,
    //       body: reqSession.req.body || null
    //     },
    //     response: {
    //       statusCode: Number(reqSession.res.statusCode || 0),
    //       headers: reqSession.res.headers as Record<string, string>,
    //       body: Buffer.from(reqSession.res.base64, 'base64'),
    //     }
    //   };
    //   mock.save(data);
    // });
  });
};
