// vue
// index.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './route/router';
import store from './store/store';
import 'lib-flexible/flexible';

createApp(App).use(router).use(store).mount('#app');
