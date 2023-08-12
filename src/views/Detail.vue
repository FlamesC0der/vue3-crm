<template>
   <div>
      <Loader v-if="loading" />
      <div v-else-if="record">
         <div class="breadcrumb-wrap">
         <router-link to="/history" class="breadcrumb">{{$filters.localizeFilter('HistoryTXT')}}</router-link>
         <a @click.prevent class="breadcrumb">
            {{ record.type === 'income' ? ($filters.localizeFilter('income')) : ($filters.localizeFilter('outcome'))}}
         </a>
         </div>
         <div class="row">
         <div class="col s12 m6">
            <div class="card" :class="{
               'red': record.type === 'outcome',
               'green': record.type === 'income'
            }">
               <div class="card-content white-text">
               <p>{{$filters.localizeFilter('Description')}}: {{record.description}}</p>
               <p>{{$filters.localizeFilter('Sum')}}: {{$filters.currencyFilter(record.amount, 'RUB')}}</p>
               <p>{{$filters.localizeFilter('Category')}}: {{record.categoryName}}</p>

               <small>{{$filters.dateFilter(record.date, 'datetime')}}</small>
               </div>
            </div>
         </div>
         </div>
      </div>
      <p class="center" v-else>{{$filters.localizeFilter('Datail')}}</p>
   </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import Loader from '@/components/app/Loader.vue'
export default {
   setup() {
      useMeta({
         title: 'Detail'
      })
   },
   name: "datail",
   data: () => ({
      record: null,
      loading: true
   }),
   async mounted() {
      const id = this.$route.params.id;
      const record = await this.$store.dispatch("fetchRecordById", id);
      const category = await this.$store.dispatch("fetchCategoryById", record.categoryId);
      this.record = {
         ...record,
         categoryName: category.title
      };

      this.loading = false;
   },
   components: { Loader }
}
</script>
