const toString = Object.prototype.toString;

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]';
}
