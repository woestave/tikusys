import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router/examsys';
import naive from './naive';
import App from './app.vue';
import './assets/styles/common.less';
import { tokens } from './apis/request';

const app = createApp(App);

const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(naive);

tokens.setTokenConfig({
  toLoginMethod: () => {
    router.replace({ name: 'login', query: { redirect: router.currentRoute.value.fullPath, }, });
  },
  localTokenKey: 'RSD_TOKEN_EXAMSYS',
});

// app.config.errorHandler = (err, vm, info) => {
//   console.error('Vue app error tips: ', err);
//   console.error('Vue app error detail info: ', info);
// };

app.mount('#app');
