<template>
   <div>
      <div class="page-title">
         <h3>{{$filters.localizeFilter('Planning')}}</h3>
         <h4>{{$filters.currencyFilter(info.bill, 'RUB')}}</h4>
      </div>

      <Loader v-if="loading" />

      <p class="center" v-else-if="!categories.length">{{$filters.localizeFilter('NoCategories-one')}} <router-link to="/categories">{{$filters.localizeFilter('NoCategories-two')}}</router-link></p>

      <section v-else>
         <div v-for="cat of categories" :key="cat.id">
            <p>
               <strong>{{cat.title}}:</strong>
               {{$filters.currencyFilter(cat.spend, 'RUB')}} {{$filters.localizeFilter('Planning_Of')}} {{$filters.currencyFilter(cat.limit, 'RUB')}}
            </p>
            <div class="progress" v-tooltip="cat.tooltip">
               <div
                  class="determinate"
                  :class="[cat.progressColor]"
                  :style="{width: cat.progressPercent + '%'}"
               ></div>
            </div>
         </div>
      </section>
   </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import Loader from '@/components/app/Loader.vue'
import {mapGetters} from 'vuex'
export default {
   setup() {
      useMeta({
         title: 'Planning'
      })
   },
   name: "planning",
   data: () => ({
      loading: true,
      categories: []
   }),
   computed: {
      ...mapGetters(['info'])
   },
   async mounted() {
      const records = await this.$store.dispatch("fetchRecords");
      const categories = await this.$store.dispatch("fetchCategories");

      this.categories = categories.map(cat => {
         const spend = records
            .filter(r => r.categoryId === cat.id)
            .filter(r => r.type === 'outcome')
            .reduce((total, record) => {
               return total += +record.amount
            }, 0)
         
         const percent = 100 * spend / cat.limit
         const progressPercent = (percent > 100 ? 100 : percent)
         const progressColor = percent < 60
            ? 'green'
            : percent < 100
               ? 'yellow'
               : 'red'
         const tooltipValue = cat.limit - spend
         const tooltip = `${tooltipValue < 0 ? (this.$filters.localizeFilter('Planning_Excess')) : (this.$filters.localizeFilter('Planning_Remaining'))} ${Math.abs(tooltipValue)}`
         return {
            ...cat,
            progressPercent,
            progressColor,
            spend,
            tooltip
         }
      })

      this.loading = false;
   },
   components: { Loader }
}
</script>
