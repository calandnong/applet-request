import { describe, test, expect } from 'vitest';
import { setUniRequestConfig } from '@applet-request/api-mock';
import { HttpRequest } from '@applet-request/core';
import { UniRequestAdaptor } from '..';

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
});

describe('uni-request', () => {
  const instance = new HttpRequest(new UniRequestAdaptor());
  test('request-success', async () => {
    const res = await instance.request<CommonResponse<{}>>({
      url: 'https://www.test.com/api/getList',
      data: {
        name: '',
      },
      config: {
        method: 'POST',
      },
    });
    expect(res.code).toEqual(200);
  });

});
