import { defineConfig } from 'wxt';
import { resolve } from 'path';

export default defineConfig({
  vite: () => ({
    resolve: {
      alias: [
        {
          find: '@components',
          replacement: resolve(__dirname, './components'),
        },
        {
          find: '@features',
          replacement: resolve(__dirname, './features'),
        },
        {
          find: '@pages',
          replacement: resolve(__dirname, './pages'),
        },
        {
          find: '@services',
          replacement: resolve(__dirname, './services'),
        },
        {
          find: '@utils',
          replacement: resolve(__dirname, './utils'),
        },
        {
          find: '@hooks',
          replacement: resolve(__dirname, './hooks'),
        },
        {
          find: '@assets',
          replacement: resolve(__dirname, './assets'),
        },
        {
          find: '@types',
          replacement: resolve(__dirname, './types'),
        },
        {
          find: '@context',
          replacement: resolve(__dirname, './context'),
        },
        {
          find: '@utils',
          replacement: resolve(__dirname, './utils'),
        },
        {
          find: '@guard',
          replacement: resolve(__dirname, './guard'),
        },
      ],
    },
  }),
  manifest: {
    name: 'Smart Notes',
    description: 'Smart Notes Chrome Extension',
    version: '1.0.0',
    permissions: ['storage', 'activeTab', 'notifications', 'alarms'],
  },
});
