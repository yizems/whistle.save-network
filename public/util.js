const DEFALT_COLUMNS = [
  {name: '方法', path: 'method'},
  {name: '状态', path: 'result'},
  {name: 'URL', path: 'url'},
  {name: 'type', path: 'type'}
];

function columnText2Columns(text) {
  if (!text || text.length == 0) return null;
  return text.split(/\n|\r/).map(line => {
    const idx = line.indexOf(":");
    if (idx > 0) {
      return {
        name: line.slice(0, idx).trim(),
        path: line.slice(idx + 1).trim()
      };
    }
  }).filter(Boolean);
}

function columsToText(columns) {
  if (!columns || columns.length == 0) return '';
  return columns.map(col => `${col.name}: ${col.path}`).join('\n');
}

function decodeBase64ToUtf8Str(data) {
  const binary = atob(data);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function getBodyByContentType(item, isRes) {
  if (!item) return '';
  let headers, contentType, body, base64;
  if (isRes) {
    headers = item.res && item.res.headers || {};
    contentType = headers['content-type'] || headers['Content-Type'] || '';
    body = item.res && item.res.body;
    base64 = item.res && item.res.base64;
  } else {
    headers = item.req && item.req.headers || {};
    contentType = headers['content-type'] || headers['Content-Type'] || '';
    body = item.req && item.req.body;
    base64 = item.req && item.req.base64;
  }
  // 图片
  if (/image\//i.test(contentType) && base64) {
    return `<img src="data:${contentType};base64,${base64}" style="max-width:100%;max-height:300px;" />`;
  }
  // html
  if (/text\/html/i.test(contentType) && typeof body === 'string') {
    return `<iframe srcdoc="${body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')}" style="width:100%;height:300px;border:none;"></iframe>`;
  }
  // json
  if (/application\/json/i.test(contentType)) {
    try {
      let json = body;
      if (!json && base64) json = decodeBase64ToUtf8Str(base64);
      return `<pre style='background:#f7f7f7;padding:6px;'>${JSON.stringify(JSON.parse(json), null, 2)}</pre>`;
    } catch (e) {
    }
  }
  // 文本
  if (/text\//i.test(contentType) && typeof body === 'string') {
    return `<pre style='background:#f7f7f7;padding:6px;'>${body || (base64 ? decodeBase64ToUtf8Str(base64) : '')}</pre>`;
  }
  // 默认
  return `<pre style='background:#f7f7f7;padding:6px;'>${body || base64 || ''}</pre>`;
}
