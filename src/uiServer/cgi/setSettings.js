import { stat } from 'fs';
import getSettings from './getSettings';

const readStat = (dir) => {
  return new Promise((resolve) => {
    stat(dir, (err, stat) => {
      if (err) {
        return resolve({
          code: 2,
          msg: err.code === 'ENOENT' ? '该目录不存在，请先创建该目录' : '系统异常，请稍后再试',
        });
      }
      if (!stat.isDirectory()) {
        return resolve({
          code: 3,
          msg: '路径非目录',
        });
      }
      resolve();
    });
  });
};

export default async (ctx) => {
  let { middlewareBaseDir } = ctx.request.body;
  if (typeof middlewareBaseDir !== 'string') {
    middlewareBaseDir = '';
  }
  if (middlewareBaseDir) {
    const result = await readStat(middlewareBaseDir);
    if (result) {
      ctx.body = result;
      return;
    }
  }
  const { localStorage } = ctx.req;
  localStorage.setProperty('middlewareBaseDir', middlewareBaseDir);
  getSettings(ctx);
};
