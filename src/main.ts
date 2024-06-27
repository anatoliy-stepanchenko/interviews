import './assets/main.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyAfISk9PhGuhgJ8lWrOTo0_Ocglmtp8duw',
  authDomain: 'interviews-ac397.firebaseapp.com',
  projectId: 'interviews-ac397',
  storageBucket: 'interviews-ac397.appspot.com',
  messagingSenderId: '1085004829146',
  appId: '1:1085004829146:web:72e34916da6dde29b7b0e3'
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(ToastService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)

app.mount('#app')
