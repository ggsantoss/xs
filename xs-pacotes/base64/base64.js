const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const B64_URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function encode(str, urlSafe = false) {
  if (str == null || str === "") return "";
  const alphabet = urlSafe ? B64_URL : B64;
  const bytes = new TextEncoder().encode(str);
  let result = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const triple = (b1 << 16) | (b2 << 8) | b3;
    result += alphabet[(triple >> 18) & 0x3F];
    result += alphabet[(triple >> 12) & 0x3F];
    result += i + 1 < bytes.length ? alphabet[(triple >> 6) & 0x3F] : (urlSafe ? "" : "=");
    result += i + 2 < bytes.length ? alphabet[triple & 0x3F] : (urlSafe ? "" : "=");
  }
  return result;
}

function decode(str) {
  if (str == null || str === "") return "";
  str = str.replace(/=+$/, "").replace(/-/g, "+").replace(/_/g, "/");
  const bytes = [];
  for (let i = 0; i < str.length; i += 4) {
    const c1 = B64.indexOf(str[i]);
    const c2 = B64.indexOf(str[i + 1] || "A");
    const c3 = str[i + 2] ? B64.indexOf(str[i + 2]) : 0;
    const c4 = str[i + 3] ? B64.indexOf(str[i + 3]) : 0;
    const triple = (c1 << 18) | (c2 << 12) | (c3 << 6) | c4;
    bytes.push((triple >> 16) & 0xFF);
    if (str[i + 2] && str[i + 2] !== "=") bytes.push((triple >> 8) & 0xFF);
    if (str[i + 3] && str[i + 3] !== "=") bytes.push(triple & 0xFF);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function encodeFile(bytes, urlSafe = false) {
  if (!bytes || bytes.length === 0) return "";
  const alphabet = urlSafe ? B64_URL : B64;
  let result = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const triple = (b1 << 16) | (b2 << 8) | b3;
    result += alphabet[(triple >> 18) & 0x3F];
    result += alphabet[(triple >> 12) & 0x3F];
    result += i + 1 < bytes.length ? alphabet[(triple >> 6) & 0x3F] : "=";
    result += i + 2 < bytes.length ? alphabet[triple & 0x3F] : "=";
  }
  return result;
}

function decodeToBytes(str) {
  if (str == null || str === "") return new Uint8Array(0);
  str = str.replace(/=+$/, "").replace(/-/g, "+").replace(/_/g, "/");
  const bytes = [];
  for (let i = 0; i < str.length; i += 4) {
    const c1 = B64.indexOf(str[i]);
    const c2 = B64.indexOf(str[i + 1] || "A");
    const c3 = str[i + 2] ? B64.indexOf(str[i + 2]) : 0;
    const c4 = str[i + 3] ? B64.indexOf(str[i + 3]) : 0;
    const triple = (c1 << 18) | (c2 << 12) | (c3 << 6) | c4;
    bytes.push((triple >> 16) & 0xFF);
    if (str[i + 2] && str[i + 2] !== "=") bytes.push((triple >> 8) & 0xFF);
    if (str[i + 3] && str[i + 3] !== "=") bytes.push(triple & 0xFF);
  }
  return new Uint8Array(bytes);
}

const VALID_B64 = /^[A-Za-z0-9+/]*={0,2}$/;
const VALID_B64_URL = /^[A-Za-z0-9_-]*$/;

function isValid(str) {
  if (!str || str === "") return false;
  if (VALID_B64.test(str)) return true;
  if (VALID_B64_URL.test(str)) return true;
  return false;
}

function tamanho(str) {
  if (!str || str === "") return 0;
  const pads = str.match(/=+$/)?.[0]?.length || 0;
  const groups = Math.floor(str.length / 4);
  return groups * 3 - pads;
}

export default { encode, decode, encodeURL: (s) => encode(s, true), decodeURL: decode, encodeFile, decodeToBytes, isValid, tamanho };
