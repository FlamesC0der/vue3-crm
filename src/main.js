import { createApp } from 'vue'
import App from './App'

import { createMetaManager } from 'vue-meta'
import useVuelidate from '@vuelidate/core'
import Paginate from "vuejs-paginate-next"
import Toaster from '@meforma/vue-toaster'
import './registerServiceWorker'

import router from './router'
import store from './store'

import Loader from '@/components/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min.js'

import directives from '@/directives';
//* ==================Firebase====================
import { initializeApp } from "firebase/app";

const firebaseConfig = { //* firebase
   apiKey: "",
   authDomain: "",
   databaseURL: "",
   projectId: "",
   storageBucket: "",
   messagingSenderId: "",
   appId: "",
   measurementId: ""
};

initializeApp(firebaseConfig);
//* ==============================================

const app = createApp(App)

directives.forEach(directive => {
   app.directive(directive.name, directive)
})

//* ==================Filters====================

import ru from '@/locales/ru.json'
import en from '@/locales/en.json'

const locales = { //* Файлы локализации
   'ru-RU': ru,
   'en-US': en
}

app.config.globalProperties.$filters = {
   localizeFilter(key) { //* LOCALIZE
      const locale = store.getters.info.locale || 'ru-RU'
      return locales[locale][key] || `[localize error]: key ${key} not found`
   },
   dateFilter(d, format = 'date') { //* DATE FILTER
      const options = {}
      if (format.includes('date')) {
         options.day = '2-digit'
         options.month = 'long'
         options.year = 'numeric'
      }
      if (format.includes('time')) {
         options.hour = '2-digit'
         options.minute = '2-digit'
         options.second = '2-digit'
      }
      const locale = store.getters.info.locale || 'ru-RU'
      return new Intl.DateTimeFormat(locale, options).format(new Date(d))
   },
   currencyFilter(value, currency = 'RUB') { //* CURRENCY FILTER
      return new Intl.NumberFormat('ru-RU', {
         style: 'currency',
         currency
      }).format(value)
   }
}
//* ==============================================

app
   .component('Loader', Loader)
   .component('Paginate', Paginate)
   .use(createMetaManager())
   .use(useVuelidate)
   .use(Toaster)
   .use(store)
   .use(router)
   .mount('#app')
