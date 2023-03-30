import { setUniRequestConfig } from '../..';

setUniRequestConfig({
  'www.baidu.com': {
    isSuccess: true,
    getData(request) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore
      // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log('result', result);
  },
});

