import { stat } from 'fs';
import path from "path";
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
    if (!path.isAbsolute(middlewareBaseDir)) {
      ctx.body = {
        code: 4,
        msg: `${middlewareBaseDir} 不是绝对路径`,
      };
      return;
    }
  }
  const { localStorage } = ctx.req;
  for (const key in ctx.request.body) {
    if (!key) {
      continue;
    }
    const value = (ctx.request.body[key] || "").trim();
    localStorage.setProperty(key, value);
  }
  ctx.body = ctx.request.body;
};
