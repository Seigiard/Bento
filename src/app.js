import { createApp } from 'vue';
import App from './components/App.vue';
import Icon from './components/Icon.vue';

const app = createApp(App);
app.component('Icon', Icon);
app.mount('#app');
