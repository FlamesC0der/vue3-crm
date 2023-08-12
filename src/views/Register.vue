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
               :class="{invalid: (v$.password.$error || score <= 2)}"
         >
         <label for="password">Пароль</label>
         <password-meter @score="onScore" :password="state.password" />
         <small class="helper-text invalid" v-if="score <= 2">Введите более сложный пароль</small>
         <small 
            class="helper-text invalid"
            v-if="v$.password.$error"
         >
            Введите Пароль
         </small>
         </div>
         <div class="input-field">
         <input
               id="name"
               type="text"
               autocomplete="on"
               v-model.trim="state.name"
               :class="{invalid: v$.name.$error}"
         >
         <label for="name">Имя</label>
         <small 
            class="helper-text invalid"
            v-if="v$.name.$error"
         >
            Введите имя
         </small>
         </div>
         <p>
         <label>
            <input type="checkbox" v-model="state.agree">
            <span>С правилами согласен</span>
         </label>
         </p>
      </div>
      <div class="card-action">
         <div>
         <button
               class="btn waves-effect waves-light auth-submit"
               type="submit"
         >
            Зарегистрироваться
            <i class="material-icons right">send</i>
         </button>
         </div>

         <p class="center">
         Уже есть аккаунт?
         <router-link to="/login">Войти!</router-link>
         </p>
      </div>
   </form>
</template>

<script>
import { useMeta } from 'vue-meta'
import useVuelidate from '@vuelidate/core' // Vuelidate
import {email, required, minLength} from '@vuelidate/validators'
import { reactive, computed } from 'vue'
import { defineComponent, ref } from "vue"; // Password strength
import PasswordMeter from "vue-simple-password-meter";

export default {
   name: 'register',
   components: {
      PasswordMeter,
   },
   setup() {
      useMeta({
         title: 'Register'
      })
      const password = ref("");
      const email = ref("")
      const score = ref(null);
      const onScore = (payload) => { // Password strength
         score.value = payload.score;
      };
      const state = reactive({ // Vuelidate
         email: '',
         password: '',
         name: '',
         agree: false
      })
      const rules = computed(() => {
         return {
            email: {required, email},
            password: {required, minLength: minLength(6)},
            name: {required , minLength: minLength(3)},
            agree: {checked: v => v}
         }
      })
      const v$ = useVuelidate(rules, state)
      return {
         state,
         v$,
         password,
         email,
         onScore,
         score
      }
   },
   methods: {
      async submitHandler() {
         this.v$.$validate()
         if (!this.v$.$error && this.score > 2) {
            const formData = {
               email: this.state.email,
               password: this.state.password,
               name: this.state.name
            }
            try {
               await this.$store.dispatch('register', formData)
               this.$toast.success('Аккаунт был успешно создан', {
                  position: 'top-right'
               })
               this.$router.push('/')
            } catch (e) {}
         }
      }
   }
}
</script>
