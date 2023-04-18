import { buildFullPath, buildURL, mergeConfig, BaseException } from '@applet-request/shared';
import type {
  Middleware,
  Adapter,
  RequestContext,
  TransformRequestConfig,
  RequestDefaultConfig,
  RequestConfig,
} from '..';
import { compose } from '../compose/index';

/**
 * 网络请求类
 */
export class HttpRequest<Config = unknown, CommonResponse = unknown, RawResponse = unknown> {
  /**
   * 所有中间件
   */
  private middleware: Middleware<RequestContext<Config, CommonResponse, RawResponse>>[] = [];

  /**
   * 默认请求配置
   */
  private defaultConfig: TransformRequestConfig<Config> = {
    url: '',
    baseURL: '',
    apiURL: '',
  };

  /**
   * 网络请求类
   * @param adapter 适配器
   */
  constructor(private adapter: Adapter<Config, CommonResponse, RawResponse>) {
  }

  /**
   * 合并和覆盖默认请求配置
   * @param config
   */
  private mergeConfig(config: Partial<TransformRequestConfig<Config>>) {
    this.defaultConfig = mergeConfig(this.defaultConfig, config);
  }

  /**
   * 设置请求默认配置
   * @param config
   */
  setDefaultConfig(config: RequestDefaultConfig<Config>) {
    this.mergeConfig({
      ...config,
    });
  }

  /**
   * 使用中间件
   * @param middleware
   */
  use(middleware: Middleware<RequestContext<Config, CommonResponse, RawResponse>>) {
    this.middleware.push(middleware);
  }

  /**
   * 请求方法
   * @param options
   * @returns
   */
  request<Response>(options: RequestConfig<Config>): Promise<Response & CommonResponse> {
    const request = compose(this.middleware);
    const context = this.createContext<Response>(options);
    return request(context, (context, next) => {
      return this.adapter.request(context, next);
    }).then(() => {
      if (!context.response.data) {
        return Promise.reject(new BaseException('Response data is empty!'));
      }
      return context.response.data;
    });
  }

  /**
   * 深克隆默认配置
   */
  private cloneDefaultConfig() {
    return JSON.parse(JSON.stringify(this.defaultConfig)) as TransformRequestConfig<Config>;
  }

  /**
   * 初始化默认配置
   * @param options
   * @returns
   */
  private transformRequest(options: RequestConfig<Config>) {
    /**
     * 获取全路径url
     */
    const url = buildURL(buildFullPath(this.defaultConfig.baseURL, options.url), options.params);
    // 转换配置信息
    const transformRequest = mergeConfig<TransformRequestConfig<Config>, TransformRequestConfig<Config>>(this.cloneDefaultConfig(), {
      ...options,
      apiURL: url,
    });
    return transformRequest;
  }

  /**
   * 创建中间件上下文
   * @param options
   * @returns
   */
  private createContext<Response>(options: RequestConfig<Config>): RequestContext<Config, CommonResponse & Response, RawResponse, HttpRequest<Config, CommonResponse & Response, RawResponse>> {
    return {
      requestInstance: this as HttpRequest<Config, CommonResponse & Response, RawResponse>,
      options: JSON.parse(JSON.stringify(options)),
      request: this.transformRequest(options),
      response: {
        data: undefined as CommonResponse & Response,
        raw: undefined as RawResponse,
      },
    };
  }
}
