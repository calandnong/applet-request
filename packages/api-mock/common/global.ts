/**
 * 获取node环境下的全局属性
 */
export const getGlobalProperty = (key: string) => {
  return global[key as keyof typeof global];
};

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
