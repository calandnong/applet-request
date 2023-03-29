import { Adaptor } from '@applet-request/core';
import type { 
  RequestContext,
  MiddlewareNext,
} from '@applet-request/core';

export type UniRequestConfig = Omit<UniApp.RequestOptions, 'url' | 'data' | 'fail' | 'success' | 'complete'>;

export class UniRequestAdaptor<Data> extends Adaptor<
UniRequestConfig,
Data,
UniApp.RequestSuccessCallbackResult
> {
  async request(context: RequestContext<UniRequestConfig, Data, UniApp.RequestSuccessCallbackResult>, next: MiddlewareNext): Promise<unknown> {
    await next();
    return new Promise((resolve, reject) => {
      uni.request({
        ...context.request.config,
        url: context.request.apiURL,
        data: context.request.data,
        success(res) {
          context.response.data = res.data as Data;
          context.response.raw = res;
          resolve(res);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }
}
