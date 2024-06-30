import type { Stream } from 'stream';
import { isPlainObject } from './utils';

const { toString } = Object.prototype;

const kindOf = (cache => (thing: unknown) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type: string) => {
  type = type.toLowerCase();
  return (thing: unknown) => kindOf(thing) === type;
};

const isArrayBuffer = kindOfTest('ArrayBuffer');

const typeOfTest = (type: string) => (thing: unknown) => typeof thing === type;

const isFunction = typeOfTest('function');

const isUndefined = typeOfTest('undefined');

function isBuffer(val: unknown) {
  return val !== null && !isUndefined(val) && (val as object).constructor !== null && !isUndefined((val as object).constructor)
    && isFunction(((val as Buffer).constructor as BufferConstructor).isBuffer) && ((val as Buffer).constructor as BufferConstructor).isBuffer(val);
}

const isObject = (thing: unknown) => thing !== null && typeof thing === 'object';

const isStream = (val: unknown) => isObject(val) && isFunction((val as Stream).pipe);

const isFile = kindOfTest('File');

const isBlob = kindOfTest('Blob');

const isString = typeOfTest('string');

function isArrayBufferView(val: unknown): val is ArrayBufferView {
  let result: boolean;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  }
  else {
    result = Boolean((val) && ((val as Buffer).buffer) && (isArrayBuffer((val as Buffer).buffer)));
  }
  return result;
}

const trim = (str: string) => str.trim
  ? str.trim()
  : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

const isURLSearchParams = kindOfTest('URLSearchParams');

const isFormData = (data: unknown) => {
  return data instanceof FormData;
};

function stringifySafely(rawValue: unknown, parser?: (data: unknown) => unknown, encoder?: (data: unknown) => string) {
  if (isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue as string);
      return trim(String(rawValue));
    }
    catch (e: unknown) {
      if ((e as Error).name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

export function transformRequest(data: unknown, headers: Record<string, string>) {
  const contentType = headers['Content-Type'];
  const hasJSONContentType = contentType.indexOf('application/json') > -1;

  const isObjectPayload = isObject(data);

  if (!isPlainObject(data)) {
    return data;
  }

  if (
    isFormData(data)
    || isArrayBuffer(data)
    || isBuffer(data)
    || isStream(data)
    || isFile(data)
    || isBlob(data)
  ) {
    return data;
  }
  if (isArrayBufferView(data)) {
    return data.buffer;
  }
  if (isURLSearchParams(data)) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    return data.toString();
  }

  if (isObjectPayload || hasJSONContentType) {
    return stringifySafely(data);
  }

  return data;
}
