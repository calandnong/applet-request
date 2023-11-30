import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Applet Request',
  description: 'Awesome Applet Request Library',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/introduce/what-is-applet-request' },
      { text: 'API', link: '/api/core' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '介绍',
          collapsed: false,
          base: '/guide/introduce/',
          items: [
            { text: '什么是AppletRequest？', link: '/what-is-applet-request' },
            { text: '开始使用', link: '/getting-started' },
          ],
        },
        {
          text: '核心概念',
          collapsed: false,
          base: '/guide/core/',
          items: [
            { text: '默认配置', link: '/default-config' },
            { text: '中间件', link: '/middleware' },
            { text: '适配器', link: '/adapter' },
          ],
        },
        {
          text: '适配器列表',
          collapsed: false,
          base: '/guide/adapters/',
          items: [
            { text: 'axios 适配器', link: '/axios' },
            { text: 'uni.downloadFile 适配器', link: '/uniapp-downloadFile' },
            { text: 'uni.request 适配器', link: '/uniapp-request' },
            { text: 'uni.uploadFile 适配器', link: '/uniapp-uploadFile' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'packages',
          base: '/api/',
          items: [
            {
              text: '@applet-request/core',
              link: '/core',
            },
            {
              text: '@applet-request/adapters',
              link: '/adapters',
            },
            {
              text: '@applet-request/shared',
              link: '/shared',
            },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
});
