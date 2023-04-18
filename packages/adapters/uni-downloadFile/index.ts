import { Adapter } from '@applet-request/core';
import type { RequestContext, MiddlewareNext, RequestConfig } from '@applet-request/core';

/**
 * uni.downloadFile的其他请求配置
 */
export type UniDownloadFileOtherConfig = Omit<UniApp.DownloadFileOption, 'url' | 'fail' | 'success' | 'complete'>;

/**
 * uni.downloadFile的请求配置
 */
export type UniDownloadFileConfig = RequestConfig<UniDownloadFileOtherConfig>;

/**
 * uni.downloadFile的请求适配器
 */
export class UniDownloadFileAdaptor extends Adapter<
  UniDownloadFileOtherConfig,
  string,
  UniApp.DownloadSuccessData
> {
  async request(
    context: RequestContext<
      UniDownloadFileOtherConfig,
      string,
      UniApp.DownloadSuccessData
    >,
    next: MiddlewareNext,
  ) {
    await next();
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        ...context.request.config,
        url: context.request.apiURL,
        success(res) {
          context.response.data = res.tempFilePath;
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
