export function stringifyBuffer(data: unknown): string {
  if (data && Buffer.isBuffer(data)) {
    return data.toString("utf-8");
  }
  return data as string;
}