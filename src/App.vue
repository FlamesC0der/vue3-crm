<template>
<metainfo>
   <template v-slot:title="{ content }">{{ content ? `${content} | ${appName}` : `${appName}` }}</template>
</metainfo>
<component :is="layout">
   <router-view></router-view>
</component>
</template>

<script>
import { useMeta } from 'vue-meta'
import EmptyLayout from '@/layouts/EmtyLayout'
import MainLayout from './layouts/MainLayout'
export default {
   setup () {
      const appName = process.env.VUE_APP_TITLE
      useMeta({
         title: '',
         htmlAttrs: { lang: 'en', amp: true }
      })
      return {
         appName
      }
   },
   computed: {
      layout() {
         return (this.$route.meta.layout || 'empty') + '-layout'
      }
   },
   components: {
      EmptyLayout, MainLayout
   }
}
</script>

<style lang="scss">
@import '~materialize-css/dist/css/materialize.min.css';
@import 'assets/index.css';
.po-password-strength-bar {
   border-radius: 2px;
   transition: all 0.2s linear;
   height: 5px;
   margin-top: 8px;
}
.po-password-strength-bar.risky {
   background-color: #f95e68;
   width: 10%;
}
.po-password-strength-bar.guessable {
   background-color: #fb964d;
   width: 32.5%;
}
.po-password-strength-bar.weak {
   background-color: #fdd244;
   width: 55%;
}
.po-password-strength-bar.safe {
   background-color: #b0dc53;
   width: 77.5%;
}
.po-password-strength-bar.secure {
   background-color: #35cc62;
   width: 100%;
}
.pagination {
   cursor: pointer;
}
</style>
