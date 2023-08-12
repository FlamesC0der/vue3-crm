import { createStore } from 'vuex'
import auth from './auth'
import info from './info'
import category from './category'
import record from './record'

export default createStore({
   state: {
      error: null
   },
   mutations: {
      setError(state, error) {
         state.error = error
      },
      clearError(state) {
         state.error = null
      }
   },
   getters: {
      error: s => s.error
   },
   actions: {
      async fetchCurrency() {
         
         const key = process.env.VUE_APP_FIXER
         
         var myHeaders = new Headers();
         myHeaders.append("apikey", key);
         const res = await fetch("https://api.apilayer.com/fixer/latest?symbols=USD%2CRUB%2CEUR&base=EUR", {method: 'GET', redirect: 'follow', headers: myHeaders})
         return await res.json()
         
      }
   },
   modules: {
      auth, info, category, record
   }
})
