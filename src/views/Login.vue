<template>
   <form class="card auth-card" @submit.prevent="submitHandler">
      <div class="card-content">
         <span class="card-title">Домашняя бухгалтерия</span>
         <div class="input-field">
         <input
               id="email"
               type="text"
               autocomplete="on"
               v-model.trim="state.email"
               :class="{invalid: v$.email.$error}"
         >
         <label for="email">Email</label>
         <small 
            class="helper-text invalid"
            v-if="v$.email.$error"
         >
            Введите Email
         </small>
         </div>
         <div class="input-field">
         <input
               id="password"
               type="password"
               autocomplete="on"
               v-model.trim="state.password"
               :class="{invalid: v$.password.$error}"
         >
         <label for="password">Пароль</label>
         <small 
            class="helper-text invalid"
            v-if="v$.password.$error"
         >
            Введите Пароль
         </small>
         </div>
      </div>
      <div class="card-action">
         <div>
         <button
               class="btn waves-effect waves-light auth-submit"
               type="submit"
         >
            Войти
            <i class="material-icons right">send</i>
         </button>
         </div>

         <p class="center">
         Нет аккаунта?
         <router-link to="/register">Зарегистрироваться</router-link>
         </p>
      </div>
   </form>
</template>

<script>
import { useMeta } from 'vue-meta'
import useVuelidate from '@vuelidate/core'
import {email, required, minLength} from '@vuelidate/validators'
import { reactive, computed } from 'vue'
import messages from '@/utils/messagePlugin/messages'
export default {
   name: 'login',
   setup() {
      useMeta({
         title: 'Login'
      })
      const state = reactive({
         email: '',
         password: ''
      })
      const rules = computed(() => {
         return {
            email: {required, email},
            password: {required, minLength: minLength(6)}
         }
      })
      const v$ = useVuelidate(rules, state)
      return {
         state,
         v$
      }
   },
   mounted() {
      if (messages[this.$route.query.message]) {
         this.$toast.warning(messages[this.$route.query.message], {
            position: 'top-right'
         })
      }
   },
   methods: {
      async submitHandler() {
         this.v$.$validate()
         if (!this.v$.$error) {
            const formData = {
               email: this.state.email,
               password: this.state.password,
            }
            try {
               await this.$store.dispatch('login', formData) // Запрос на вход
               this.$toast.success('Успешный вход в аккаунт', {
                  position: 'top-right'
               })
               this.$router.push('/')
            } catch (e) {}
         }
      },
   }
}
</script>
