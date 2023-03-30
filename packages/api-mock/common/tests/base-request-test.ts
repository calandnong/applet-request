import { useBaseRequest } from '@applet-request/api-mock';

const { setConfig, baseRequest } = useBaseRequest<{
  name: string;
}, {
  age: number;
}>();

setConfig({
  111: {
    isSuccess: true,
    getData() {
      return {
        age: 111,
      };
    },
  },
});

async function setup() {
  const res = await baseRequest({
    url: '111',
    name: '',
  });
  // eslint-disable-next-line no-console
  console.log('返回了res', res.age);
}



// 测试启动
setup().catch((err) => {
  // eslint-disable-next-line no-console
  console.log('有信息', String(err));
});
