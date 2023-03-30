/**
 * node环境下设置全局属性
 * @param key 
 * @param value 
 */
export const setGlobalProperty = <Value>(key: string, value: Value) => {
  Object.defineProperty(global, key, {
    value,
  });
};
