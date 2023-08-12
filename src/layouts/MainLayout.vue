<template>
   <div>
      <Loader v-if="loading" />
      <div class="app-main-layout" v-else>

      <Navbar @clickb="isOpen = !isOpen" />
      <Sidebar :value="isOpen" :key="locale" />

      <main class="app-content" :class="{full: !isOpen}">
         <div class="app-page">
            <router-view></router-view>
         </div>
      </main>

      <div class="fixed-action-btn">
         <router-link class="btn-floating btn-large blue" to="/record" v-tooltip="`${$filters.localizeFilter('CreateNewRecord')}`">
            <i class="large material-icons">add</i>
         </router-link>
      </div>
   </div>
   </div>
</template>
<script>
import messages from '@/utils/messagePlugin/messages'
import Navbar from '@/components/app/Navbar'
import Sidebar from '@/components/app/Sidebar'
import Loader from '@/components/app/Loader.vue'
export default {
   name: 'mainlayout',
   data: () => ({
      isOpen: true,
      loading: true
   }),
   async mounted() {
      if (!Object.keys(this.$store.getters.info).length) {
         this.$store.dispatch('fetchInfo')
         console.log(1)
      }

      this.loading = false
   },
   components: {
      Navbar,
      Sidebar,
      Loader
   },
   computed: {
      error() {
         return this.$store.getters.error
      },
      locale() {
         return this.$store.getters.info.locale
      }
   },
   watch: {
      error(fbError) {
         this.$toast.error(messages[fbError.code] || 'что-то пошло не так...', {
            position: 'top-right'
         })
      }
   }
}
</script>

<style scoped>
.app-content {
   padding-left: 10px;
}
</style>
