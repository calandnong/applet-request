import type { RequestParams } from '@applet-request/shared';

export type {
  RequestParams,
};

/**
 * 请求配置
 */
export interface RequestConfig<Config = unknown> {
  /**
   * 接口请求地址
   */
  url: string;
  /**
   * 路由参数
   */
  params?: RequestParams;
  /**
   * 请求体, 以后有更动态需求可以考虑替换为unknown
   */
  data?: unknown;
  /**
   * 其他配置
   */
  config?: Config;
}

/**
 * 格式化完成的请求配置
 */
export interface TransformRequestConfig<Config> extends RequestConfig<Config> {
  /**
   * 请求基础地址，默认为空字符串
   */
  baseURL: string;
  /**
   * 请求方法已拼接的url
   */
  apiURL: string;
}

/**
 * 响应数据
 */
export interface Response<Data = unknown, RawResponse = unknown> {
  /**
   * 开发者服务器返回数据
   */
  data: Data;
  /**
   * 底层接口返回的数据原串
   */
  raw: RawResponse;
}

/**
 * 中间件上下文
 */
export interface RequestContext<Config = unknown, Data = unknown, RawResponse = unknown, Instance = unknown> {
  /**
   * 请求实例
   */
  requestInstance: Instance;
  /**
   * 请求实例.request方法传入的初始配置
   */
  options: RequestConfig<Config>;
  /**
   * 请求实例内转换后的请求配置
   */
  request: TransformRequestConfig<Config>;
  /**
   * 响应相关配置
   */
  response: Response<Data, RawResponse>;
}

/**
 * 创建请求时的基础配置
 */
export interface RequestDefaultConfig<Config> {
  /**
  * 请求基础地址，默认为空字符串
  */
  baseURL?: string;
  /**
  * 其他基本配置
  */
  config?: Config;
}
