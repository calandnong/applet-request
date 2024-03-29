import { describe, test, expect } from 'vitest';
import { setUniRequestConfig } from '@applet-request/api-mock';
import { HttpRequest } from '@applet-request/core';
import consola from 'consola';
import { UniRequestAdapter, UniRequestFailException } from '..';

interface CommonResponse<Data = unknown> {
  code: number;
  msg: string;
  data: Data;
}

interface Response extends UniApp.RequestSuccessCallbackResult {
  data: CommonResponse;
}

// 定义mock的接口列表
setUniRequestConfig<Response>({
  /**
   * 获取列表
   */
  'https://www.test.com/api/getList': {
    isSuccess: true,
    getData(request) {
      if (request.method === 'GET') {
        return {
          statusCode: 500,
          cookies: [],
          header: {},
          data: {
            code: 500,
            msg: '不支持此method',
            data: '',
          },
        };
      }
      return {
        statusCode: 200,
        cookies: [],
        header: {},
        data: {
          code: 200,
          msg: 'ok',
          data: {},
        },
      };
    },
  },
  'https://www.test.com/api/getFail': {
    isSuccess: false,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore
    getData() {
      return {
        errMsg: '出错了',
      };
    },
  },
});

describe('uni-request', () => {
  const instance = new HttpRequest(new UniRequestAdapter());

  instance.setDefaultConfig({
    baseURL: 'https://www.test.com',
  });

  instance.use(async ({ request, response }, next) => {
    consola.log('request.config', request);
    await next();
    consola.log(response);
  });
  test('request-success', async () => {
    const res = await instance.request<CommonResponse<{}>>({
      url: '/api/getList',
      data: {
        name: '',
      },
      config: {
        method: 'POST',
      },
    });
    expect(res.code).toEqual(200);
  });
  test('request-fail', async () => {
    try {
      await instance.request<CommonResponse<{}>>({
        url: '/api/getList',
        data: {
          name: '',
        },
        config: {
          method: 'POST',
        },
      });
    }
    catch (error) {
      expect(error instanceof UniRequestFailException).toEqual(true);
    }
  });
});
