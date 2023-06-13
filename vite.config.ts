/**
 * Vite configuaration file
 * https://vitejs.dev/config/
 */

import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJSX from '@vitejs/plugin-vue-jsx';
// import mockApp from './mock';
import path from 'path';

// const mock = (): Plugin => ({
//   name: 'mock',
//   configureServer: async server => {
//     // mount mock server, `/mock` is the base url
//     server.middlewares.use('/mock', mockApp);
//   },
// });


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
  // root: '/',
  // base: '/',
  base: './',
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
  ],
  build: {
    rollupOptions: {
      input: {
        tikusys: path.resolve(__dirname, 'tikusys.html'),
        examsys: path.resolve(__dirname, 'examsys.html'),
      },
      output: {
        manualChunks: {
          'naive-ui': ['naive-ui']
        }
      }
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@mock': '/mock',
      'common-packages': '/common-packages',
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
  server: {
    cors: true,
    host: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:4000',
        // rewrite: x => x.replace(/^\/api\/tiku-server/, '/api'),
        changeOrigin: true,
      },
    },
  },
})
