export default (ctx) => {
  const { localStorage } = ctx.req;
  ctx.body = {
    middlewareBaseDir: localStorage.getProperty('middlewareBaseDir') || "",
  };
};
