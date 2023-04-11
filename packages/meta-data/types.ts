/**
 * 程序包清单
 */
export interface PackageManifest {
  /**
   * 包名
   */
  name: string;
  /**
   * 显示名称
   */
  displayName: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 是否将第三方依赖external
   */
  external?: string[];
  /**
   * 是否打包cjs
   */
  cjs?: boolean;
  /**
   * 是否打包mjs
   */
  mjs?: boolean;
  /**
   * 是否打包.d.ts
   */
  dts?: boolean;
  /**
   * 是否需要打包第三方依赖
   */
  resolve?: boolean;
  /**
   * 是否浏览器环境使用
   */
  browser?: boolean;
}
