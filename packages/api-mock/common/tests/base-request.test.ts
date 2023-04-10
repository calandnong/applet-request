import { describe, test, expect } from 'vitest';
import { useBaseRequest } from '@applet-request/api-mock';

describe('api-mock:useBaseRequest', () => {
  const { requestMap, setConfig, baseRequest } = useBaseRequest<{
    name: string;
  }, {
    age: number;
  }>();

  test('set api is Correct by used setConfig', () => {
    const request = {
      isSuccess: true,
      getData() {
        return {
          age: 111,
        };
      },
    };
    setConfig({
      'https://www.test.com/getName': request,
        
    });
    expect(requestMap.get('https://www.test.com/getName')).toEqual(request);
  });

  test('baseRequest', async () => {
    const res = await baseRequest({
      url: 'https://www.test.com/getName',
      name: '',
    });
    console.log('返回了res', res.age);
    expect(res.age).toBe(111);
  });
});
