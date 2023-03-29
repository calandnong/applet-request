/**
 * 判断请求状态是否成功
 * @param status http状态码
 * @returns
 */
export function isHttpSuccess(status: number) {
  return (status >= 200 && status < 300) || status === 304;
}
