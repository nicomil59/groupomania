import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/scss/bootstrap.scss";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './services/Api'

createApp(App).use(store).use(router).mount('#app')
