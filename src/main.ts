import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import naive from './naive';
import App from './app.vue';
import './assets/styles/common.less';

const app = createApp(App);

const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(naive);

// app.config.errorHandler = (err, vm, info) => {
//   console.error('Vue app error tips: ', err);
//   console.error('Vue app error detail info: ', info);
// };

app.mount('#app');
