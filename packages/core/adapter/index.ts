import type { RequestContext, MiddlewareNext } from '@applet-request/core';

/**
 * 请求适配器
 */
export abstract class Adaptor<Config = unknown, Data = unknown, RawResponse = unknown> {
  /**
   * 适配的请求方法
   * @param context 中间件上下文
   * @param next
   */
  abstract request(context: RequestContext<Config, Data, RawResponse>, next: MiddlewareNext): Promise<unknown>;
}
