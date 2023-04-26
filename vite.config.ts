/**
 * Vite configuaration file
 * https://vitejs.dev/config/
 */

import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJSX from '@vitejs/plugin-vue-jsx';
import mockApp from './mock';

const mock = (): Plugin => ({
  name: 'mock',
  configureServer: async server => {
    // mount mock server, `/api` is the base url
    server.middlewares.use('/api', mockApp);
  },
})

// for parse sfc custom blocks
// https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks
// const sfcCustomBlocks = (): Plugin => ({
//   name: 'sfcCustomBlocks',
//   transform: (code, id) => {
//     if (!id.includes('vue&type=title')) return
//     // title black
//     return `export default Component => {
//       Component.title = '${code}'
//     }`
//   }
// })

export default defineConfig({
  plugins: [
    vue(),
    /**
     * jsx-if插件必须放到vueJSX()上面。
     * 否则vueJSX编译过后，jsx-if插件就找不到<If></If>标签了。
     */
    vueJSX({
      babelPlugins: [require('./babel-plugin-vue-jsx-if')],
    }),
    vueJSX(),
    mock(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'naive-ui': ['naive-ui']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@mock': '/mock',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    modules: {
      generateScopedName: `_[name]_[local]_[hash:base64:6]_`,
    },
  },
})
