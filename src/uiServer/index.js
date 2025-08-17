import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import { join } from 'path';
const router = require('koa-router')();
import setupRouter from './router';

const MAX_AGE = 1000 * 60 * 5;

export default (server) => {
  const app = new Koa();
  app.proxy = true;
  setupRouter(router);
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(serve(join(__dirname, '../../public'), MAX_AGE));
  server.on('request', app.callback());
};
