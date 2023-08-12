<template>
   <div>
      <div class="page-title">
         <h3>{{$filters.localizeFilter('Categories')}}</h3>
      </div>
      <section>
         <Loader v-if="loading" />
         <div class="row" v-else>
            <CategoryCreate @created="addNewCategory" />
            
            <CategoryEdit 
               v-if="categories.length"
               :categories="categories"
               :key="categories.length + updateCount"
               @updated="updateCategories"
            />
            <p v-else class="center">{{$filters.localizeFilter('NoCategories-one')}}</p>
         </div>
      </section>
   </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'
import Loader from '@/components/app/Loader.vue'
export default {
   setup() {
      useMeta({
         title: 'Categories'
      })
   },
   name: 'categories',
   data: () => ({
      categories: [],
      loading: true,
      updateCount: 0
   }),
   async mounted() {
      this.categories = await this.$store.dispatch('fetchCategories')
      this.loading = false
   },
   components: {
      CategoryCreate,
      CategoryEdit,
      Loader
},
   methods: {
      addNewCategory(categorytoCreate) {
         this.categories = categorytoCreate
      },
      updateCategories(category) {
         const idx = this.categories.findIndex(c => c.id === category.id)
         this.categories[idx].title = category.title
         this.categories[idx].limit = category.limit
         this.updateCount++
      }
   }
}
</script>
