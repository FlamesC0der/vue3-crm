<template>
   <div class="grey darken-1 empty-layout">
      <router-view></router-view>
   </div>
</template>

<script>
import messages from '@/utils/messagePlugin/messages'
export default {
   computed: {
      error() {
         return this.$store.getters.error
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
