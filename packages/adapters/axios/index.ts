import { Adapter } from '@applet-request/core';
import type {
  RequestContext,
  MiddlewareNext,
  RequestConfig,
} from '@applet-request/core';
import { BaseException, isHttpSuccess } from '@applet-request/shared';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import AxiosStatic from 'axios';

/**
 * 请求单例
 */
const request = AxiosStatic.create();

/**
 * axios的其他请求配置
 */
export type AxiosOtherConfig = Omit<AxiosRequestConfig, 'url' | 'params' | 'data'>;

/**
 * axios的请求配置
 */
export type AxiosConfig = RequestConfig<AxiosOtherConfig>;

/**
 * axios的请求适配器
 */
export class AxiosAdapter<Data> extends Adapter<
AxiosOtherConfig,
Data,
AxiosResponse
> {
  async request(context: RequestContext<AxiosOtherConfig, Data, AxiosResponse>, next: MiddlewareNext): Promise<unknown> {
    await next();
    return request({
      ...context.request.config,
      url: context.request.apiURL,
      data: context.request.data,
    }).then((res) => {
      if (isHttpSuccess(res.status)) {
        context.response.data = res.data;
        context.response.raw = res;
        return res;
      }
      return Promise.reject(new BaseException('系统繁忙，请重试！', res));
    });
  }
}
