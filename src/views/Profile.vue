<template>
   <div>
      <div class="page-title">
         <h3>{{$filters.localizeFilter('Profile')}}</h3>
      </div>

      <form class="form" @submit.prevent="submitHandler">
         <div class="input-field">
         <input
               id="description"
               type="text"
               v-model="state.name"
               :class="{invalid: v$.name.$error}"
         >
         <label for="description">{{$filters.localizeFilter('Name')}}</label>
         <small
               class="helper-text invalid" v-if="v$.name.$error">{{$filters.localizeFilter('Profile_Error_EnterNewName')}}</small>
         </div>

         <div class="switch">
            <label>
               English
               <input type="checkbox" v-model="isRuLocale">
               <span class="lever"></span>
               Русский
            </label>
         </div>

         <button class="btn waves-effect waves-light" type="submit">
         {{$filters.localizeFilter('Update')}}
         <i class="material-icons right">send</i>
         </button>
      </form>
   </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import useVuelidate from '@vuelidate/core'
import {required, minLength} from '@vuelidate/validators'
import { reactive, computed } from 'vue'
import {mapGetters, mapActions} from 'vuex'
export default {
   setup() {
      useMeta({
         title: 'Profile'
      })
   },
   data: () => ({
      name: '',
      isRuLocale: true
   }),
   setup() {
      useMeta({
         title: 'Profile'
      })
      const state = reactive({
         name: '',
      })
      const rules = computed(() => {
         return {
            name: {required, minLength: minLength(3)}
         }
      })
      const v$ = useVuelidate(rules, state)
      return {
         state,
         v$
      }
   },
   created() {
      this.state.name = this.info.name
   },
   mounted() {
      this.name = this.info.name
      this.isRuLocale = this.info.locale === 'ru-RU'
      setTimeout(() => {
         M.updateTextFields()
      })
   },
   computed: {
      ...mapGetters(['info'])
   },
   methods: {
      ...mapActions(['updateInfo']),
      async submitHandler() {
         this.v$.$validate()
         if (!this.v$.$error) {
            try {
               await this.updateInfo({
                  name: this.state.name,
                  locale: this.isRuLocale ? 'ru-RU' : 'en-US'
               })
            } catch (e) {}
         }
      }
   }
}
</script>

<style scoped>
.switch {
   margin-bottom: 2rem;
}
</style>
