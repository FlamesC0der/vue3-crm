<template>
   <div>
      <div class="page-title">
         <h3>{{$filters.localizeFilter('Home')}}</h3>

         <button class="btn waves-effect waves-light btn-small" @click="refresh">
         <i class="material-icons">refresh</i>
         </button>
      </div>

      <Loader v-if="loading" />

      <div v-else class="row">

         <HomeBill
         :rates="currency.rates"
         />


         <HomeCurrency
         :rates="currency.rates"
         :date="currency.date"
         />

      </div>
   </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import HomeBill from '@/components/HomeBill'
import HomeCurrency from '@/components/HomeCurrency'
import Loader from '@/components/app/Loader.vue'
export default {
   setup() {
      useMeta({
         title: 'Home'
      })
   },
   name: 'home',
   data: () => ({
      loading: true,
      currency: null
   }),
   async mounted() {
      this.currency = await this.$store.dispatch('fetchCurrency')
      this.loading = false
   },
   methods: {
      async refresh() {
         this.loading = true
         this.currency = await this.$store.dispatch('fetchCurrency')
         this.loading = false
      }
   },
   components: {
      HomeBill,
      HomeCurrency,
      Loader
}
}
</script>
