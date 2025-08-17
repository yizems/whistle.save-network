import { parseJson } from "./parseJson";
import { stringifyBuffer } from "./stringifyBuffer";

export function parseBodyByType(contentType: string, data: string | Buffer) {
  if (typeof contentType == "string") {
    if (contentType.includes("json")) {
      return parseJson(data);
    }
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const body = (stringifyBuffer(data) || "").trim();
      if (!body) {
        return null;
      }
      const query = new URLSearchParams(body);
      return Object.fromEntries(query.entries());
    }
  }
  return null;
}