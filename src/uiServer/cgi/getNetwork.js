import path from "path";
import fsExtra from "fs-extra";
import {defaultDir} from "../../library/utils";

export default async (ctx) => {
  const {localStorage} = ctx.req;
  let dir = localStorage.getProperty("savedDir");
  if (!dir) {
    dir = defaultDir();
  }

  let files = [];
  try {
    files = await fsExtra.readdir(dir);
  } catch (e) {
    ctx.body = [];
    return;
  }
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  const result = [];
  for (const file of jsonFiles) {
    const filePath = path.join(dir, file);
    try {
      const obj = await fsExtra.readJson(filePath);
      obj.fileName = file; // 添加文件名到根节点
      result.push(obj);
    } catch (e) {
      // 忽略无法解析的文件
    }
  }
  ctx.body = result;
};
