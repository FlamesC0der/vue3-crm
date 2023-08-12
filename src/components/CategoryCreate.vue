<template>
   <div class="col s12 m6">
      <div>
         <div class="page-subtitle">
            <h4>{{$filters.localizeFilter('Create')}}</h4>
         </div>

         <form @submit.prevent="submitHandler">
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
                  {{$filters.localizeFilter('Caterogy_Create_Error_Name')}}
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
                  {{$filters.localizeFilter('Caterogy_Create_Error_Limit')}} {{v$.limit.minValue.$params.min}}
               </span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
               {{$filters.localizeFilter('Create')}}
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
export default {
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
   mounted() {
      M.updateTextFields()
   },
   methods: {
      async submitHandler() {
         this.v$.$validate()
         if (!this.v$.$error) {
            try {
               const category = await this.$store.dispatch('createCategory', {
                  title: this.state.title,
                  limit: this.state.limit,
               })
               this.state.title = ''
               this.state.limit = 100
               this.v$.$reset()
               this.$toast.success('Категория была создана', {
                  position: 'top-right'
               })
               console.log("createdCat: ", category)
               this.$emit('created', category)
            } catch (e) {
               console.log(e)
               throw e
            }
         }
      }
   }
}
</script>
