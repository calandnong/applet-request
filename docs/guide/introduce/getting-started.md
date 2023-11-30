## 安装
用你喜欢的包管理器安装 `@applet-request/core`、`@applet-request/adapters`、`@applet-request/shared`：
```bash
yarn add @applet-request/core @applet-request/adapters @applet-request/shared
# 或者使用 npm
npm install @applet-request/core @applet-request/adapters @applet-request/shared
# 或者使用 pnpm
pnpm add @applet-request/core @applet-request/adapters @applet-request/shared
```

## 简单使用（基于uniapp）
在你的项目下创建文件`request.ts`:
```typescript
import { HttpRequest } from '@applet-request/core';
import type { UniRequestConfig } from '@applet-request/adapters';
import { UniRequestAdapter } from '@applet-request/adapters';

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

// 创建请求实例，使用uniapp的请求适配器
const requestInstance = new HttpRequest(new UniRequestAdapter<CommonResponse>());

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
export function request<Response = never>(options: UniRequestConfig) {
  return requestInstance.request<
    Response extends never ? CommonResponse<Response> : RequestResponse<Response>
  >(options);
}
```

请求登陆接口封装`login.ts`：
```typescript
import { request } from './request';

export interface Auth {
  /**
   * token令牌
   */
  token: string;
}

export function login() {
  return request<Auth>({
    url: '/auth/signIn',
    config: {
      method: 'POST',
    },
  });
}
```

使用登陆接口`use-login.ts`:
```typescript
import { login } from 'login';

login()
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
});

```

## 中间件使用示例
简易错误捕获中间件:
```typescript
/**
 * 所有的错误处理中间件，需要放在最前面
 */
requestInstance.use(async (context, next) => {
  try {
    await next();
  }
  catch (error) {
    // 这里进行对异常进行处理
  }
});
```

处理http层错误报错中间件:
```typescript
import { BaseException } from '@applet-request/shared';
import { isHttpSuccess } from '@applet-request/shared';

class HttpException extends BaseException {
  name = 'HttpException';
}

/**
 * 处理http层错误报错中间件
 */
requestInstance.use(async (context, next) => {
  try {
    await next();
  }
  catch (error) {
    // 判断是否是http成功的状态
    if (!isHttpSuccess(context.response.raw.statusCode)) {
      throw new HttpException('错误，请重试！', context.response.raw);
    }
    // 不是则原错误继续向外抛出
    throw error;
  }
});
```