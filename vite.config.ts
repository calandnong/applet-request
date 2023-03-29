import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    dir: resolve(__dirname, './packages'),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@applet-request/core': resolve(__dirname, './packages/core/index.ts'),
      '@applet-request/adaptors': resolve(__dirname, './packages/adaptors/index.ts'),
      '@applet-request/shared': resolve(__dirname, './packages/shared/index.ts'),
    },
  },
});
