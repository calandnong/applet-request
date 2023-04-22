import { isPlainObject } from './utils';

export function transformRequest<Data>(data: Data) {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}
