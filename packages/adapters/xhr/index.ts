import type { MiddlewareNext, RequestConfig, RequestContext, TransformRequestConfig } from '@applet-request/core';
import { Adapter } from '@applet-request/core';
import { BaseException, isHttpSuccess, transformRequest } from '@applet-request/shared';

export interface XHRBasicCredentials {
  username: string;
  password: string;
}

export interface XHROtherConfig {
  /**
   * 请求类型
   */
  method?: string;
  /**
   * 请求头
   */
  header?: Record<string, string>;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
  withCredentials?: boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  auth?: XHRBasicCredentials;
}

export type XHRConfig = RequestConfig<XHROtherConfig>;

export interface XHRResponse<Response> {
  data: Response;
  status: number;
  statusText: string;
  headers: unknown;
  config: TransformRequestConfig<XHROtherConfig>;
  xhr: XMLHttpRequest;
}

export class XHRAdapter<Data> extends Adapter<
XHROtherConfig,
  Data,
  unknown
> {
  async request(
    context: RequestContext<
      XHROtherConfig,
      Data,
      XHRResponse<Data>
    >,
    next: MiddlewareNext,
  ) {
    await next();
    return new Promise((resolve, reject) => {
      const {
        apiURL,
        config = {},
        data,
      } = context.request;
      const {
        responseType,
        timeout,
        withCredentials,
        header = {},
        xsrfCookieName,
        xsrfHeaderName,
        auth,
      } = config;

      const xhr = new XMLHttpRequest();

      function configureRequest() {
        if (responseType) {
          xhr.responseType = responseType;
        }

        if (timeout) {
          xhr.timeout = timeout;
        }

        if (withCredentials) {
          xhr.withCredentials = withCredentials;
        }
      }

      function parseHeaders(headers: string): unknown {
        const parsed = Object.create(null);
        if (!headers) {
          return parsed;
        }

        headers.split('\r\n').forEach((line) => {
          let [key, ...vals] = line.split(':');
          key = key.trim().toLowerCase();
          if (!key) {
            return;
          }
          const val = vals.join(':').trim();
          parsed[key] = val;
        });

        return parsed;
      }

      function handleResponse(response: XHRResponse<Data>): void {
        function transformResponse(data: unknown): unknown {
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            }
            catch (e) {
              // do nothing
            }
          }
          return data;
        }

        if (isHttpSuccess(xhr.status)) {
          response.data = transformResponse(response.data) as Data;
          context.response.data = response.data;
          context.response.raw = response;
          resolve(response);
        }
        else {
          reject(new BaseException('请求失败'));
        }
      }

      function addEvents(): void {
        xhr.onreadystatechange = function handleLoad() {
          if (xhr.readyState !== 4) {
            return;
          }

          if (xhr.status === 0) {
            return;
          }

          const responseHeaders = parseHeaders(xhr.getAllResponseHeaders());
          const responseData
            = responseType && responseType !== 'text' ? xhr.response : xhr.responseText;
          const response: XHRResponse<Data> = {
            data: responseData,
            status: xhr.status,
            statusText: xhr.statusText,
            headers: responseHeaders,
            config: context.request,
            xhr,
          };
          handleResponse(response);
        };

        xhr.onerror = function handleError() {
          reject(new BaseException('Network Error', context));
        };

        xhr.ontimeout = function handleTimeout() {
          reject(
            new BaseException(`Timeout of ${config.timeout} ms exceeded`),
          );
        };
      }

      // 设置自定义请求头
      function isFormData(val: unknown): val is FormData {
        return typeof val !== 'undefined' && val instanceof FormData;
      }

      interface URLOrigin {
        protocol: string;
        host: string;
      }

      function resolveURL(url: string): URLOrigin {
        const urlParsingNode = document.createElement('a');
        urlParsingNode.setAttribute('href', url);
        const { protocol, host } = urlParsingNode;
        return {
          protocol,
          host,
        };
      }

      function isURLSameOrigin(requestURL: string): boolean {
        const currentOrigin = resolveURL(window.location.href);
        const parsedOrigin = resolveURL(requestURL);
        return (
          parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
        );
      }

      function processHeaders(): void {
        if (isFormData(data)) {
          delete header['Content-Type'];
        }

        if ((withCredentials || isURLSameOrigin(apiURL)) && xsrfCookieName) {
          const cookie = {
            read(name: string): string | null {
              const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
              return match ? decodeURIComponent(match[3]) : null;
            },
          };
          const xsrfValue = cookie.read(xsrfCookieName);
          if (xsrfValue && xsrfHeaderName) {
            header[xsrfHeaderName] = xsrfValue;
          }
        }

        if (auth) {
          header.Authorization = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;
        }

        Object.keys(header).forEach((name) => {
          if (data === null && name.toLowerCase() === 'content-type') {
            delete header[name];
          }
          else {
            xhr.setRequestHeader(name, header[name]);
          }
        });
      }

      // 打开链接,对应参数: "请求类型","请求url"，“是否异步处理”
      xhr.open((config?.method || 'GET').toUpperCase(), apiURL, true);

      //
      configureRequest();

      // 转换data
      const finalData = transformRequest(data, header);

      // 监听回调
      addEvents();

      // 设置自定义请求头
      processHeaders();

      xhr.send(finalData as Document | XMLHttpRequestBodyInit | null | undefined);
    });
  }
}
