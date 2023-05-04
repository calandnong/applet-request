import { Adapter } from '@applet-request/core';
import type { RequestContext, MiddlewareNext, RequestConfig } from '@applet-request/core';

/**
 * uni.downloadFile的其他请求配置
 */
export type UniUploadFileOtherConfig = Omit<UniApp.UploadFileOption, 'url' | 'fail' | 'success' | 'complete' | 'formData'>;

/**
 * uni.downloadFile的请求配置
 */
export type UniUploadFileConfig = RequestConfig<UniUploadFileOtherConfig>;

/**
 * uni.uploadFile的请求适配器
 */
export class UniUploadFileAdaptor<Data> extends Adapter<
  UniUploadFileOtherConfig,
  Data,
  UniApp.UploadFileSuccessCallbackResult
> {
  async request(
    context: RequestContext<
      UniUploadFileOtherConfig,
      Data,
      UniApp.UploadFileSuccessCallbackResult
    >,
    next: MiddlewareNext,
  ) {
    await next();
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        ...context.request.config,
        url: context.request.apiURL,
        formData: context.request.data,
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
