import fs from "fs";

export function isJson(text: string) {
  const json = (text || "").split("\n").map(line => line.trim()).filter(line => line.length > 0);
  return json[0].startsWith("{") || json[0].startsWith("[");
}

export function isYaml(text: string) {
  const yaml = (text || "").split("\n").map(line => line.trim()).filter(line => line.length > 0);
  return /^\w+: /.test(yaml[0]);
}

let MKDIR_CACHE = new Map<string, boolean>();
export function mkdirSync(dir: string, force?: boolean) {
  if (MKDIR_CACHE.size > 1000) {
    MKDIR_CACHE.clear();
  }
  if (MKDIR_CACHE.has(dir) && !force) {
    return;
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true
    });
  }
  MKDIR_CACHE.set(dir, true);
}