## 什么是适配器？
此处使用了适配器设计模式，适配器是当前请求的核心概念，请求库的core部分是与框架/平台无关的实现，我们需要根据core提供的核心抽象类进行适配各个不同的框架/平台，用于抹平差异。

## 官方提供的适配器
| 适配器 | 说明 |
| ------- | ----------- |
| [AxiosAdapter](/guide/adapters/axios) | 适配axios |
| [UniDownloadFileAdaptor](/guide/adapters/uniapp-downloadFile) | 适配uni.downloadFile |
| [UniRequestAdapter](/guide/adapters/uniapp-request) | 适配uni.request |
| [UniUploadFileAdaptor](/guide/adapters/uniapp-uploadFile) | 适配uni.uploadFile |
| [XHROtherConfig](/guide/adapters/xhr) | 适配xhr |

## 如何自己编写适配器？
```typescript
import { Adapter } from '@applet-request/core';
import type {
  RequestContext,
  MiddlewareNext,
  RequestConfig,
} from '@applet-request/core';

/**
 * 你的其他请求适配配置
 */
export type XxxRequestOtherConfig = {};

/**
 * xxx的请求配置
 */
export type XxxRequestConfig = RequestConfig<XxxConfig>;

/**
 * 你需要适配的请求回调原串类型
 */
export type RequestSuccessCallbackResult = {};

/**
 * uni.request的请求适配器
 */
export class XxxRequestAdapter<Data> extends Adapter<
XxxRequestOtherConfig,
Data,
RequestSuccessCallbackResult
> {
  async request(context: RequestContext<XxxRequestOtherConfig, Data, RequestSuccessCallbackResult>, next: MiddlewareNext): Promise<unknown> {
    await next();
    return new Promise((resolve, reject) => {
      // 你的适配逻辑
    });
  }
}

```