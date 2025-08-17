export function stringifyJson(data: unknown) {
  if (data === null || data === undefined) {
    return null;
  }
  if (data instanceof Symbol) {
    return null;
  }

  try {
    return JSON.stringify(data);
  } catch (ex) {
    console.warn("stringifyJson error: ", ex);
    return null;
  }
}