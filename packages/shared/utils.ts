const toString = Object.prototype.toString;

export function isPlainObject(val: unknown): val is Object {
  return toString.call(val) === '[object Object]';
}
