## 默认配置
配置的覆盖需要调用`setDefaultConfig`方法进行设置，其入参类型为：
```typescript
/**
 * 创建请求时的基础配置
 */
interface RequestDefaultConfig<Config> {
  /**
   * 请求基础地址，默认为空字符串
   */
  baseURL?: string;
  /**
   * 其他基本配置
   */
  config?: Config;
}
```
:::tip
不同的适配器，【其他基本配置】不一样，实际入参请关注对应的适配器类型。
:::