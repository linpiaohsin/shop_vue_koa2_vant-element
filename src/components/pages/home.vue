<template>
	<div>
		<div class="mainArea">
			<keep-alive>
				<router-view @changeTab="change"/>
			</keep-alive>

		</div>
		<van-tabbar v-model='active' @change='clickTabBar()'>
			<van-tabbar-item icon="wap-home">首页</van-tabbar-item>
			<van-tabbar-item icon="shop-o">列表</van-tabbar-item>
            <van-tabbar-item icon="shopping-cart-o">购物车</van-tabbar-item>
            <van-tabbar-item icon="manager-o">个人中心</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script>
	import { Icon } from 'vant';
	export default {
		name:'home',
		data() {
			return {
				active:0
			};
		},
		methods: {
			change(){
			   this.active = 1
			//    console.log('22222');
			   
			},
			changeTabBar(){
				let path = this.$route.path
				if(path == '/cart'){
					this.active = 2
				}
			},
			clickTabBar() {
				// console.log(this.active)
				switch(this.active){
						case 0:
							this.$router.push({name : 'shoppingMall'})
							break
						case 1:
							this.$router.push({name : 'categoryList'})
							break
						case 2:
							this.$router.push({name : 'cart'})
							break
						case 3:
							if(localStorage.getItem('loginStatus')=='true' ){
								this.$router.push({name : 'personal'})
							}else{
								this.$router.push('login')
							}
							break
				}
			}
		},
		created(){
			this.changeTabBar()
		},
		updated(){
			this.changeTabBar()
		}
	}
</script>

<style>

</style>
