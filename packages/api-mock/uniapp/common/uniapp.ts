import { getGlobalProperty, setGlobalProperty } from '../../index';

/**
 * uniapp的api的环境key
 */
const GLOBAL_KEY = 'uni' as const;

/**
 * 往全局uni变量挂载数据
 * @param key 
 * @param value 
 * @returns 
 */
export const setUniPropertyOfGlobal = <Value>(key: string, value: Value) => {
  // 判断是否存在uni变量
  if (!getGlobalProperty(GLOBAL_KEY)) {
    setGlobalProperty(GLOBAL_KEY, {
      [key]: value,
    });
    return;
  }
  Object.assign(getGlobalProperty(GLOBAL_KEY), {
    [key]: value,
  });
};
