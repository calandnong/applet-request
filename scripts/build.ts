import consola from 'consola';
import { execSync } from 'node:child_process';


function build() {
  consola.info('Rollup build');
  execSync('pnpm run build:rollup', { stdio: 'inherit' });
}

build();
