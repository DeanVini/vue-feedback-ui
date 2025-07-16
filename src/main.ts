import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import Tooltip from 'primevue/tooltip'
import { primeVueTheme } from '@/theme/primeVueTheme.ts'
import '/src/assets/animation/intro.scss'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: primeVueTheme,
  },
})
app.use(ToastService)
app.directive('tooltip', Tooltip)

app.mount('#app')
