<template>
   <div>
      <div class="page-title">
         <h3>{{$filters.localizeFilter('History')}}</h3>
      </div>

      <div class="history-chart">
         <canvas id="myChart"></canvas>
      </div>

      <Loader v-if="loading" />

      <p class="center" v-else-if="!records.length">
         {{$filters.localizeFilter('NoRecord-one')}}
         <router-link to="/record">{{$filters.localizeFilter('NoRecord-two')}}</router-link>
      </p>

      <section v-else>
         <HistoryTable :records="items" />
         
         <Paginate
            v-model="page"
            :page-count="pageCount"
            :click-handler="pageChangeHandler"
            :prev-text="$filters.localizeFilter('History_Pagination_back')"
            :next-text="$filters.localizeFilter('History_Pagination_forward')"
            :container-class="'pagination'"
            :page-class="'waves-effect'"
         ></Paginate>
      </section>
   </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import paginationMixin from '@/mixins/pagination.mixin'
import HistoryTable from '@/components/HistoryTable'
import Loader from '@/components/app/Loader'

import {Pie} from 'vue-chartjs'
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
   setup() {
      useMeta({
         title: 'History'
      })
   },
   name: 'history',
   extends: Pie,
   components: { HistoryTable, Loader, DoughnutChart },
   mixins: [paginationMixin],
   data: () => ({
      loading: true,
      records: []
   }),
   async mounted() {
      this.records = await this.$store.dispatch("fetchRecords")
      const categories = await this.$store.dispatch("fetchCategories")

      this.setup(categories)

      this.loading = false
   },
   methods: {
      setup(categories) {
         this.setupPagination(this.records.map(record => {
            return {
               ...record,
               categoryName: categories.find(c => c.id === record.categoryId).title,
               typeClass: record.type === 'income' ? 'green' : 'red',
               typeText: record.type === 'income' ? (this.$filters.localizeFilter('income')) : (this.$filters.localizeFilter('outcome')),
            }
         }))

         const ctx = document.getElementById('myChart')

         const myChart = new Chart(ctx, {
            type: 'pie',
            data: {
               labels: categories.map(c => c.title),
               datasets: [{
                  label: 'Расходы по категориям',
                  data: categories.map(c => {
                     return this.records.reduce((total, r) => {
                        if (r.categoryId === c.id && r.type === 'outcome') {
                           total += +r.amount
                        }
                        return total
                     }, 0)
                  }),
                  backgroundColor: [
                     'rgba(255, 99, 132, 0.2)',
                     'rgba(54, 162, 235, 0.2)',
                     'rgba(255, 206, 86, 0.2)',
                     'rgba(75, 192, 192, 0.2)',
                     'rgba(153, 102, 255, 0.2)',
                     'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                     'rgba(255, 99, 132, 1)',
                     'rgba(54, 162, 235, 1)',
                     'rgba(255, 206, 86, 1)',
                     'rgba(75, 192, 192, 1)',
                     'rgba(153, 102, 255, 1)',
                     'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1,
                  hoverOffset: 4
               }]
            }
         });
      }
   }
}
</script>

<style scoped>
.history-chart {
   max-width: 300px;
}
</style>
