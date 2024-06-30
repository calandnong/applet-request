## 简介
uni.downloadFile的适配器。

## 使用
```typescript
import { HttpRequest } from '@applet-request/core';
import type { UniDownloadFileConfig } from '@applet-request/adapters';
import { UniDownloadFileAdaptor } from '@applet-request/adapters';

// 创建请求实例，使用uniapp的下载适配器
const requestInstance = new HttpRequest(new UniDownloadFileAdaptor());

// 设置默认请求配置
requestInstance.setDefaultConfig({
  baseURL: '', // 这里改为你的业务接口前缀
});

/**
 * 基础请求方法
 * @param options 请求参数
 * @returns 返回服务端的服务响应内容
 */
export function request(options: UniDownloadFileConfig) {
  return requestInstance.request(options);
}
```