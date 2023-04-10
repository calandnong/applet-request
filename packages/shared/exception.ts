interface ErrorOptions {
  cause?: unknown;
}

/**
 * 请求的基础异常
 */
export class BaseException<Raw = unknown> extends Error {
  raw: Raw;
  constructor(message: string, raw: Raw = message as Raw, options?: ErrorOptions) {
    super(message, options);
    this.raw = raw;
  }
}
