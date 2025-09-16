import path from "path";
import fsExtra from "fs-extra";
import {defaultDir} from "../../library/utils";

export default async (ctx) => {
  const {localStorage} = ctx.req;
  let dir = localStorage.getProperty("savedDir");
  if (!dir) {
    dir = defaultDir();
  }
  const records = ctx.request.body;

  // 1. 读取目录下所有形如 0000000001.json 的文件，找最大编号
  let files = [];
  try {
    files = await fsExtra.readdir(dir);
  } catch (e) {
    // 目录不存在则创建
    await fsExtra.ensureDir(dir);
    files = [];
  }
  const matched = files
    .map(f => /^(\d{10})\.json$/.exec(f))
    .filter(Boolean)
    .map(m => parseInt(m[1], 10));
  let maxNum = matched.length > 0 ? Math.max(...matched) : 0;

  // 2. 依次保存 records
  for (let i = 0; i < records.length; i++) {
    const num = (maxNum + i + 1).toString().padStart(10, '0');
    const filePath = path.join(dir, `${num}.json`);
    await fsExtra.writeJson(filePath, records[i], {spaces: 2});
  }

  ctx.body = {};
};
