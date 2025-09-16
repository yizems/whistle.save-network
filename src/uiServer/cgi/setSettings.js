import { stat } from 'fs';
import path from "path";

// 如果目录不存在或者不是目录，返回错误信息
const checkDirState = (dir) => {
  return new Promise((resolve) => {
    stat(dir, (err, stat) => {
      if (err) {
        console.log(err)
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
  let { savedDir } = ctx.request.body;
  if (typeof savedDir !== 'string') {
    savedDir = '';
  }
  if (savedDir) {
    const result = await checkDirState(savedDir);
    if (result) {
      ctx.body = result;
      return;
    }
    if (!path.isAbsolute(savedDir)) {
      ctx.body = {
        code: 4,
        msg: `${savedDir} 不是绝对路径`,
      };
      return;
    }
  }
  const { localStorage } = ctx.req;
  console.log(localStorage)
  for (const key in ctx.request.body) {
    if (!key) {
      continue;
    }
    const value = (ctx.request.body[key] || "").trim();
    localStorage.setProperty(key, value);
  }
  ctx.body = ctx.request.body;
};
