export function parseJson<T>(data: unknown): T | null {
  if (data === null || data === undefined) {
    return null;
  }
  if (data instanceof Symbol) {
    return null;
  }
  if (Buffer.isBuffer(data)) {
    data = data.toString("utf-8");
  }
  if (typeof data === "string") {
    try {
      return JSON.parse(data as string);
    } catch (ex) {
      console.warn("parseJson error: ", ex);
    }
  }
  return null;
}