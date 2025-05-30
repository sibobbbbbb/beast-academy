import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vLongpress } from '@nanogiants/vue3-longpress';



import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('use-longpress', vLongpress);

app.mount('#app')
