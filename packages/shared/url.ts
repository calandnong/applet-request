import qs from 'qs';

/**
 * 请求的url传参类型
 */
export type RequestParams = Record<string, number | string | boolean>;

/**
 * 构建完整url
 * @param url 需要拼接的url
 * @param params 参数
 * @returns
 */
export function buildURL(
  url: string,
  params?: RequestParams,
): string {
  let finalUrl = url;
  if (!params)
    return finalUrl;

  // 处理params
  const serializedParams = qs.stringify(params);
  // 拼接params
  if (serializedParams) {
    const markIndex = url.indexOf('#');
    if (markIndex !== -1)
      finalUrl = finalUrl.slice(0, markIndex);

    finalUrl += (finalUrl.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return finalUrl;
}

/**
 * 合并baseURL和请求地址
 * @param baseURL
 * @param path
 * @returns
 */
export function buildFullPath(baseURL: string, path: string) {
  return `${baseURL}${path}`;
}
