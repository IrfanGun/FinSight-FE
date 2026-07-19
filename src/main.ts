import './assets/main.css'
import 'primeicons/primeicons.css'

import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './app/App.vue'
import { router } from './app/router'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: false,
      },
    },
  })
  .mount('#app')
