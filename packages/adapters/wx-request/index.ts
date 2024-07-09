import { Adapter } from '@applet-request/core';
import type {
  RequestContext,
  MiddlewareNext,
  RequestConfig,
} from '@applet-request/core';
import { BaseException } from '@applet-request/shared';

/**
 * wx.request的其他请求配置
 */
export type WxRequestOtherConfig = Omit<WechatMiniprogram.RequestOption, 'url' | 'data' | 'fail' | 'success' | 'complete'>;

/**
 * wx.request的请求配置
 */
export type WxRequestConfig = RequestConfig<WxRequestOtherConfig>;

export class WxRequestFailException extends BaseException<WechatMiniprogram.GeneralCallbackResult> {
  constructor(message: string, raw?: WechatMiniprogram.GeneralCallbackResult, options?: ErrorOptions | undefined) {
    super(message, raw, options);
  }
}

/**
 * Wx.request的请求适配器
 */
export class WxRequestAdapter<Data> extends Adapter<
WxRequestOtherConfig,
Data,
WechatMiniprogram.RequestSuccessCallbackResult
> {
  async request(context: RequestContext<WxRequestOtherConfig, Data, WechatMiniprogram.RequestSuccessCallbackResult>, next: MiddlewareNext): Promise<unknown> {
    await next();
    return new Promise((resolve, reject) => {
      wx.request({
        ...context.request.config,
        url: context.request.apiURL,
        data: context.request.data as (string | AnyObject | ArrayBuffer | undefined),
        success(res) {
          context.response.data = res.data as Data;
          context.response.raw = res;
          resolve(res);
        },
        fail(err) {
          reject(new WxRequestFailException(err.errMsg, err));
        },
      });
    });
  }
}
