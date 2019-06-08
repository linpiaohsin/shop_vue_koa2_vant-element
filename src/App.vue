<template>
  <router-view id="app">

    <shopping-mall></shopping-mall>
  </router-view>
</template>

<script>
import shoppingMall from '@/components/pages/shoppingMall.vue'
export default {
  name: 'App',
	components:{
		shoppingMall
	}
}
</script>

<style>
#app{
	background-color:#f0f0f0
}
</style>
