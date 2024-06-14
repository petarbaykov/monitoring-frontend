import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import VueCookies from 'vue-cookies'
import './assets/styles.css'

const app = createApp(App)

app.use(VueCookies);

store.dispatch('fetchCurrentUser')

app.use(router)
app.use(store)

app.mount('#app')
