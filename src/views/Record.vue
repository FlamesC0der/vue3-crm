<template>
   <div>
      <div class="page-title">
         <h3>{{$filters.localizeFilter('Record')}}</h3>
      </div>

      <Loader v-if="loading" />

      <p class="center" v-else-if="!categories.length">{{$filters.localizeFilter('NoCategories-one')}} <router-link to="/categories">{{$filters.localizeFilter('NoCategories-two')}}</router-link></p>

      <form class="form" v-else @submit.prevent="submitHandler">
         <div class="input-field" >
         <select ref="select" v-model="category">
            <option
               v-for="c in categories"
               :key="c.id"
               :value="c.id"
            >{{c.title}}</option>
         </select>
         <label>{{$filters.localizeFilter('Choose-category')}}</label>
         </div>

         <p>
         <label>
            <input
               class="with-gap"
               name="type"
               type="radio"
               value="income"
               v-model="type"
            >
            <span>{{$filters.localizeFilter('income')}}</span>
         </label>
         </p>

         <p>
         <label>
            <input
               class="with-gap"
               name="type"
               type="radio"
               value="outcome"
               v-model="type"
            >
            <span>{{$filters.localizeFilter('outcome')}}</span>
         </label>
         </p>

         <div class="input-field">
         <input
               id="amount"
               type="number"
               v-model.number="state.amount"
               :class="{invalid: v$.amount.$error}"
         >
         <label for="amount">{{$filters.localizeFilter('Sum')}}</label>
         <span class="helper-text invalid" v-if="v$.amount.$error">{{$filters.localizeFilter('Recoed_Error_Sum')}} {{v$.amount.minValue.$params.min}}</span>
         </div>

         <div class="input-field">
         <input
               id="description"
               type="text"
               v-model="state.description"
               :class="{invalid: v$.description.$error}"
         >
         <label for="description">{{$filters.localizeFilter('Description')}}</label>
         <span
               class="helper-text invalid" v-if="v$.description.$error">{{$filters.localizeFilter('Record_Error_EnterDescription')}}</span>
         </div>

         <button class="btn waves-effect waves-light" type="submit">
         {{$filters.localizeFilter('Create')}}
         <i class="material-icons right">send</i>
         </button>
      </form>
   </div>
</template>
\<script>
import { useMeta } from 'vue-meta'
import Loader from '@/components/app/Loader.vue'
import useVuelidate from '@vuelidate/core'
import {required, minValue} from '@vuelidate/validators'
import { reactive, computed } from 'vue'
import {mapGetters} from 'vuex'
export default {
   name: "record",
   setup() {
      useMeta({
         title: 'Record'
      })
      const state = reactive({
         amount: 1,
         description: ''
      })
      const rules = computed(() => {
         return {
            amount: {minValue: minValue(1)},
            description: {required}
         }
      })
      const v$ = useVuelidate(rules, state)
      return {
         state,
         v$
      }
   },
   data: () => ({
      loading: true,
      select: null,
      categories: [],
      category: null,
      type: 'outcome',
   }),
   async mounted() {
      this.categories = await this.$store.dispatch("fetchCategories");
      this.loading = false;

      if(this.categories.length) {
         this.category = this.categories[0].id
      }

      setTimeout(() => {
         this.select = M.FormSelect.init(this.$refs.select);
         M.updateTextFields()
      }, 0)
   },
   destroyed() {
      if (this.select && this.select.destroy) {
         this.select.destroy();
      }
   },
   computed: {
      ...mapGetters(['info']),
      canCreateRecord() {
         if (this.type === 'income') {
            return true
         }
         return this.info.bill >= this.state.amount
      }
   },
   methods: {
      async submitHandler() {
         this.v$.$validate()
         if (!this.v$.$error) {
            console.log(this.info)
            console.log(this.state.amount)
            if (this.canCreateRecord) {
               try {
                  await this.$store.dispatch('createRecord', {
                     categoryId: this.category,
                     amount: this.state.amount,
                     description: this.state.description,
                     type: this.type,
                     date: new Date().toJSON()
                  })
                  const bill = this.type === 'income'
                     ? this.info.bill + this.state.amount
                     : this.info.bill - this.state.amount
                  await this.$store.dispatch('updateInfo', {bill})
                  this.$toast.success(`Запись успешно создана`, {
                     position: 'top-right'
                  })
                  this.v$.$reset()
                  this.state.amount = 1
                  this.state.description = ''
               } catch (e) {}
            } else {
               this.$toast.warning(`Недостаточно средств на счёте (${this.state.amount - this.info.bill})`, {
                  position: 'top-right'
               })
            }
         }
      }
   },
   components: { Loader }
}
</script>
