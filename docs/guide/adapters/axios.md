## 简介
axios的适配器。

## 使用
```typescript
import { HttpRequest } from '@applet-request/core';
import type { AxiosConfig } from '@applet-request/adapters';
import { AxiosAdapter } from '@applet-request/adapters';

/**
 * 定义的公共响应类型，可以不传
 */
interface CommonResponse {
  /**
   * 业务状态码
   */
  code: number;
  /**
   * 业务信息
   */
  message: string;
}

// 创建请求实例，使用axios的适配器
const requestInstance = new HttpRequest(new AxiosAdapter<CommonResponse>());

// 设置默认请求配置
requestInstance.setDefaultConfig({
  baseURL: '', // 这里改为你的业务接口前缀
});

/**
 * 请求默认响应格式，可以根据你的业务特性替换为你的
 */
export interface RequestResponse<Response> extends CommonResponse {
  data: Response;
}

/**
 * 基础请求方法
 * @param options 请求参数
 * @returns 返回服务端的服务响应内容
 */
export function request<Response = never>(options: AxiosConfig) {
  return requestInstance.request<
    Response extends never ? CommonResponse<Response> : RequestResponse<Response>
  >(options);
}
```