
export default (server: Whistle.PluginServer, options: Whistle.PluginOptions) => {
  server.on('request', (req: Whistle.PluginRequest, res: Whistle.PluginResponse) => {
    // console.log("req: ", req.url);
    // rules & values
    // res.end(JSON.stringify({
    //   rules: '',
    //   values: {},
    // }));

    // rules
    res.end('');
  });
};
