export default (ctx) => {
  const query = new URLSearchParams(ctx.req.url.split("?")[1] || "");
  const { localStorage } = ctx.req;
  const body = {};
  (query.get("keys") || "").split(",")
    .forEach(key => {
      if (!key) {
        return;
      }
      body[key] = localStorage.getProperty(key) ?? "";
    });
  ctx.body = body;
};
