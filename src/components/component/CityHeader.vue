<template>
  <div class="cityHead">
    <van-nav-bar
    title='城市选择'
    left-text='返回'
    left-arrow
    @click-left='onclickeLft'
		
    />
  </div>
</template>
<script>
export default {
  name:'CityHeader',
	methods: {
		onclickeLft() {
			this.$router.push('/')
		}
	},
}
</script>
<style lang="stylus" scoped="">

</style>
