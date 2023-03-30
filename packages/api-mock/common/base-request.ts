/**
 * 接口基础配置
 */
export interface BaseConfig {
  /**
   * 接口的地址
   */
  url: string;
}

/**
 * 默认响应配置
 */
export interface DefaultResponseConfig {
  /**
   * @description 默认请求耗时时间，接口可以自己覆盖, 单位ms，默认2000ms
   */
  timeout: number;
  /**
   * @description 请求是否成功
   */
  isSuccess: boolean;
}

export interface RequestMapResponse<Request, Data = unknown> extends Partial<DefaultResponseConfig> {
  /**
   * @description 获取响应数据
   */
  getData: (request: Request) => Data | Promise<Data>;
}

/**
 * 基础请求方法
 * @returns 
 */
export const useBaseRequest = <Request, Response = unknown>() => {
  const requestMap = new Map<string, RequestMapResponse<Request, Response>>();
  const responseConfig: DefaultResponseConfig = {
    timeout: 2000,
    isSuccess: true,
  };
  const baseRequest = (config: BaseConfig & Request) => {
    return new Promise<Response>((resolve, reject) => {
      const response = requestMap.get(config.url);
      setTimeout(async () => {
        if (!response) {
          reject(new Error(`接口【${config.url}】，未配置！`));
          return;
        }
        const data = await response.getData(config as Request);

        if (typeof response.isSuccess !== 'boolean') {
          response.isSuccess = responseConfig.isSuccess;
        }
        
        if (response.isSuccess) {
          resolve(data);
          return;
        }
 
        reject(data);
      }, response?.timeout ?? responseConfig.timeout);
    });
  };
  const setConfig = <Data extends Response>(config: Record<string, RequestMapResponse<Request, Data>>) => {
    Object.keys(config).forEach((key) => {
      requestMap.set(key, config[key]);
    });
  };

  return {
    baseRequest,
    setConfig,
  };
};
