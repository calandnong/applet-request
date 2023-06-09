import type { RollupOptions, OutputOptions, Plugin } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import { PACKAGES } from '@applet-request/meta-data';
import consola from 'consola';
import NodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/**
 * 不打包进入dist的依赖
 */
const externals = [
  '@applet-request/shared',
  '@applet-request/core',
  '@applet-request/adapters',
];

/**
 * esbuild插件
 */
const esbuildPlugin = esbuild();
/**
 * 打包.d.ts插件
 */
const dtsPlugin = dts();

/**
 * rollup配置
 */
const rollupConfigs: RollupOptions[] = [];

const getPackagePath = (name: string) => {
  return `packages/${name}`;
};

// 遍历需要构建打包的包列表
for (const { name, cjs, mjs, dts, external, resolve, browser } of PACKAGES) {
  /**
   * 当前包地址
   */
  const packageName = getPackagePath(name);
  /**
   * 包文件入口
   */
  const input = `${packageName}/index.ts`;
  /**
   * 包文件输出
   */
  const output: OutputOptions[] = [];

  /**
   * 插件配置
   */
  const plugin: Plugin[] = [];

  // 是否打包cjs
  if (cjs !== false) {
    output.push({
      file: `${packageName}/dist/index.cjs`,
      format: 'cjs',
    });
  }
  consola.info(external);

  // 是否打包mjs
  if (mjs !== false) {
    output.push({
      file: `${packageName}/dist/index.mjs`,
      format: 'es',
    });
  }

  if (resolve) {
    plugin.push(commonjs());
    plugin.push(NodeResolve({
      browser: Boolean(browser),
      preferBuiltins: false,
    }));
  }

  // 构建cjs/mjs文件
  rollupConfigs.push({
    input,
    output,
    plugins: [
      esbuildPlugin,
      ...plugin,
    ],
    external: [
      ...externals,
      ...(external || []),
    ],
  });

  // 生成.d.ts类型文件
  if (dts !== false) {
    rollupConfigs.push({
      input,
      output: {
        file: `${packageName}/dist/index.d.ts`,
        format: 'es',
      },
      plugins: [
        dtsPlugin,
      ],
      external: [
        ...externals,
        ...(external || []),
      ],
    });
  }
}

export default rollupConfigs;
