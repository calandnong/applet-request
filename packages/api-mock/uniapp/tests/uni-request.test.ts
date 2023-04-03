import { describe, test, expect } from 'vitest';
import { setUniRequestConfig } from '../..';

describe('api-mock:uni-request', () => {
  test('request will success and response correct value', () => {
    setUniRequestConfig({
      'www.baidu.com': {
        isSuccess: true,
        getData(request) {
          console.log(request);
          return {
            statusCode: 200,
            data: {},
            cookies: [],
            header: {},
          };
        },
      },
    });
    uni.request({
      url: 'www.baidu.com',
      success(result) {
        console.log('result', result);
        expect(result.statusCode).toBe(200);
      },
    });
  });
});
