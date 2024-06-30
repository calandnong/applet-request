import type { PackageManifest } from './types';

/**
 * 程序包清单列表
 */
export const PACKAGES: PackageManifest[] = [
  {
    name: 'core',
    displayName: 'Applet Request Core',
    description: 'The core logical library of applet-request',
    external: [
      '@applet-request/shared',
    ],
  },
  {
    name: 'shared',
    displayName: 'Applet Request Shared Utilities',
    description: 'The core logical library of applet-request',
    external: [
      'deepmerge',
      'qs',
    ],
  },
  {
    name: 'adapters',
    displayName: 'Adapters Collection',
    description: 'The collection of adapters for applet-request',
    external: [
      'axios',
    ],
  },
  {
    name: 'api-mock',
    displayName: 'API Mock',
    description: 'API Mock',
  },
];
