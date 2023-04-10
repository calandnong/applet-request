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
   * 第三方依赖
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
}
