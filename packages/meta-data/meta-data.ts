import type { PackageManifest } from './types';

/**
 * 程序包清单列表
 */
export const PACKAGES: PackageManifest[] = [
  {
    name: 'core',
    displayName: 'Applet Request Core',
    description: 'The core logical library of applet-request',
  },
  {
    name: 'shared',
    displayName: 'Applet Request Shared Utilities',
    description: 'The core logical library of applet-request',
    // external: [
    //   'deepmerge',
    //   'qs',
    // ],
    resolve: true,
    browser: true,
  },
  {
    name: 'adapters',
    displayName: 'Adapters Collection',
    description: 'The collection of adapters for applet-request',
  },
  {
    name: 'api-mock',
    displayName: 'API Mock',
    description: 'API Mock',
  },
];
