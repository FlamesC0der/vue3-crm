<template>
   <div class="col s12 m6">
      <div>
         <div class="page-subtitle">
         <h4>{{$filters.localizeFilter('Edit')}}</h4>
         </div>

         <form @submit.prevent="submitHandler">
         <div class="input-field" >
            <select ref="select" v-model="current">
               <option
                  v-for="c of categories"
                  :key="c.id"
                  :value="c.id"
               >{{c.title}}</option>
            </select>
            <label>{{$filters.localizeFilter('Choose-category')}}</label>
         </div>

         <div class="input-field">
            <input
               id="name"
               type="text"
               autocomplete="on"
               v-model.number="state.title"
               :class="{invalid: v$.title.$error}"
            >
            <label for="name">{{$filters.localizeFilter('Name')}}</label>
            <span
               v-if="v$.title.$error"
               class="helper-text invalid"
            >
               {{$filters.localizeFilter('Category_Edit_Error_Name')}}
            </span>
         </div>

         <div class="input-field">
            <input
               id="limit"
               type="number"
               autocomplete="on"
               v-model="state.limit"
               :class="{invalid: v$.limit.$error}"
            >
            <label for="limit">{{$filters.localizeFilter('Limit')}}</label>
            <span
               v-if="v$.limit.$error"
               class="helper-text invalid"
            >
               {{$filters.localizeFilter('Category_Edit_Error_Limit')}} {{v$.limit.minValue.$params.min}}
            </span>
         </div>

         <button class="btn waves-effect waves-light" type="submit">
            {{$filters.localizeFilter('Update')}}
            <i class="material-icons right">send</i>
         </button>
         </form>
      </div>
   </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {required, minValue} from '@vuelidate/validators'
import { reactive, computed } from 'vue'
import category from '@/store/category'
export default {
   props: {
      categories: {
         type: Array,
         required: true
      }
   },
   setup() {
      const state = reactive({
         title: '',
         limit: 100
      })
      const rules = computed(() => {
         return {
            title: {required},
            limit: {minValue: minValue(100)}
         }
      })
      const v$ = useVuelidate(rules, state)
      return {
         state,
         v$
      }
   },
   data: () => ({
      select: null,
      current: null
   }),
   watch: {
      current(catId) {
         const {title, limit} = this.categories.find(c => c.id === catId)
         this.state.title = title
         this.state.limit = limit
      }
   },
   created() {
      const {id, title, limit} = this.categories[0]
      this.current = id
      this.state.title = title
      this.state.limit = limit
   },
   methods: {
      async submitHandler() {
         this.v$.$validate()
         if (!this.v$.$error) {
            try {
               const categoryData = {
                  id: this.current,
                  title: this.state.title,
                  limit: this.state.limit
               }
               await this.$store.dispatch('updateCategory', categoryData)
               this.$toast.success('Категория была обновлена', {
                  position: 'top-right'
               })
               this.$emit('updated', categoryData)
            } catch (e) {
               
            }
         }
      }
   },
   mounted() {
      this.select = M.FormSelect.init(this.$refs.select)
      M.updateTextFields()
   },
   destroyed() {
      if (this.select && this.select.destroy) {
         this.select.destroy()
      }
   }
}
</script>
