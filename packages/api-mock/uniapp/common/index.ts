import { setGlobalProperty } from '@applet-request/api-mock';

/**
 * 往全局uni变量挂载数据
 * @param key 
 * @param value 
 * @returns 
 */
export const setUniPropertyOfGlobal = <Value>(key: string, value: Value) => {
  // 判断是否存在uni变量
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore
  if (!global.uni) {
    setGlobalProperty('uni', {
      [key]: value,
    });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore
  global.uni[key] = value;
};
