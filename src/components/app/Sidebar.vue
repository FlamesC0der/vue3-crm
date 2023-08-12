<template>
   <ul class="sidenav app-sidenav" :class="{open: value}">
      <li 
      style="color: rgba(0,0,0,0.87);
      display: block;
      font-size: 14px;
      font-weight: 500;
      height: 48px;
      line-height: 48px;">
         <router-link
         v-for="link in links"
         :key="link.url"
         tag="li"
         active-class="active"
         :to="link.url"
         :exact="link.exact"
         >
            <a class="waves-effect waves-orange pointer">{{link.title}}</a>
         </router-link>
      </li>
   </ul>
</template>

<script>
export default {
   props: ['value'],
   data: () => ({
      links: [
         {title: 'Счет', url: '/', exact: true},
         {title: 'История', url: '/history'},
         {title: 'Планирование', url: '/planning'},
         {title: 'Новая запись', url: '/record'},
         {title: 'Категории', url: '/categories'}
      ]
   })
}
</script>

<style scoped>
.pointer {
   color: rgba(0,0,0,0.87);
}
li>a {
   padding: 0px;
}
li>a>a {
   width: 100%;
}
.active {
   background-color: rgba(0,0,0,0.07);
}
</style>
