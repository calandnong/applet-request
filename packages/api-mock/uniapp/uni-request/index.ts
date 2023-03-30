import { setUniPropertyOfGlobal } from './../common/index';
import { useBaseRequest } from '@applet-request/api-mock';

const { setConfig: setUniRequestConfig, baseRequest } = useBaseRequest<UniApp.RequestOptions, UniApp.RequestSuccessCallbackResult>();

const uniRequest: UniNamespace.Uni['request'] = (options: UniApp.RequestOptions) => {
  // 默认为GET
  if (!options.method) {
    options.method = 'GET';
  }
  baseRequest(options).then((response) => {
    options.success?.(response);
    options.complete?.(response as unknown as UniApp.GeneralCallbackResult);
  }).catch((err) => {
    options.fail?.(err);
    options.complete?.(err);
  });
  return {
    abort() {
    }, 
    onHeadersReceived() {
    }, 
    offHeadersReceived() {
    },
  };
};

setUniPropertyOfGlobal('request', uniRequest);

export {
  setUniRequestConfig,
};


