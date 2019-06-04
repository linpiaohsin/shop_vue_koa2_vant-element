<template>
	<div class="cartArea">
		<div class="navBar">
			<van-nav-bar title='购物车'/>
		</div>
		<div class="clearBtn">
			<van-button type='danger' plain size='small' @click='cleanCart'>清空购物车</van-button>
		</div>
		<div class="cartGoodsArea" v-for="item in cartInfo" :key='item.goodsId'>
			<div class="imgArea">
				<img :src="item.image" width="100%" />
			</div>
			
			<div class="msgArea">
				<div class="goodsName">{{item.name}}</div>
				<div class="controlMount">
					<van-stepper v-model="item.count" />
				</div>
				
            </div>
			<div class="priceArea">
				<div>¥{{item.price|resetMoney}}</div>
				<div>x{{item.count}}</div>
				<div class="itemTotalMoney">¥{{item.count*item.price |resetMoney}}</div>
			
			
			</div>

	
		</div>
		<!-- 计算总价 -->
		<div class="totalMoney">
			<span>商品总价：¥{{totalMoney |resetMoney}}</span>
		</div>
		<div class='paddingAraa'>
			
		</div>
	</div>
</template>

<script>
	import {SetMoney} from '@/filters/Money.js'

	export default {
		name:'cart',
		data() {
			return {
				cartInfo:[],
				isEmpty:false,
			};
		},
		created(){
			this.getCartInfo()
			localStorage.removeItem('cartInfo')

		},
		methods: {
			getCartInfo() {
				if(localStorage.cartInfo ){
					this.cartInfo = JSON.parse(localStorage.cartInfo)
				}
				console.log(JSON.stringify(this.cartInfo))
				this.isEmpty = this.cartInfo.length>0?true:false
			},
			cleanCart(){
				localStorage.removeItem('cartInfo')
				location.reload()
			}
		},
		filters: {
			resetMoney(value) {
				return SetMoney(value);
			}
		},
		computed: {
			totalMoney() {
				let totalMoney = 0
				this.cartInfo.forEach((item)=>{
					totalMoney +=item.price*item.count 
				})
				localStorage.cartInfo = JSON.stringify(this.cartInfo)
				return totalMoney 
			}
		},
		
	}
</script>

<style lang="stylus" scoped="">
// 	.cartArea
// 		overflow scroll
		.clearBtn
			background-color #fff
			margin-right .2rem
			text-align right
			line-height 2rem
			height 2rem
			padding .1rem
		.cartGoodsArea
			background-color #fff
			display flex
			flex-direction row
			flex-wrap nowrap
			padding 0.5rem
			font-size 0.85rem 
			border-bottom 1px solid #E4E7ED
			.imgArea
				flex 6
			.msgArea
				flex 14
				
				.controlMount
					text-align right
					margin-top .8rem
			.priceArea
				flex:4;
				text-align right
				.itemTotalMoney
					color red
					margin-top .2rem
		.totalMoney
			background-color #fff
			border-bottom 1px solid #E4E7ED
			text-align right
			padding .3rem
		.paddingAraa
			line-height 50px
			height 50px
			background-color #fff

</style>
