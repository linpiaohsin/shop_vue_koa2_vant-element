<template>
	<div class="hotGoodsArea" @click="goGoodsPage">
		<div class="goodImage">
			<img :src="goodsImage" width="100%"/>
		</div>
		<div class="goodName">{{goodsName}}</div>
		<div class="goodPrice">¥{{goodsPrice|ResetMoney}}</div>
	</div>
</template>
<script>
	import {SetMoney} from '@/filters/Money.js'
	export default {
		data() {
			return {
				
			};
		},
		filters:{
			ResetMoney(money){
				return SetMoney(money)
			}
		},
		props:['goodsName','goodsPrice','goodsImage','goodsId'],
		methods: {
			goGoodsPage() {
				this.$router.push({name:'goods',query:{goodsId:this.goodsId}})
			}
		},
		
	}
</script>

<style lang="stylus" scoped="scoped">
	
		.goodName
			padding 0 .8rem
			overflow hidden
			text-overflow ellipsis
			white-space nowrap
		
</style>
