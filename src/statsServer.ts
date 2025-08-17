/**
 * 如果仅想获取请求的 URL、请求方法、请求头、请求内容等信息，而不对请求做任何操作，可以用 statsServer。
 */
export default (server: Whistle.PluginServer, options: Whistle.PluginOptions) => {
  server.on('request', (req: Whistle.PluginRequest) => {
    // const { originalReq } = req;
    // console.log('Value:', originalReq.ruleValue);
    // console.log('URL:', originalReq.fullUrl);
    // console.log('Method:', originalReq.method);
    // console.log('Request Headers:', originalReq.headers);
    // // get request session
    // req.getReqSession((reqSession) => {
    //   if (reqSession) {
    //     console.log('Request Body:', reqSession.req.body);
    //   }
    // });
  });
};
