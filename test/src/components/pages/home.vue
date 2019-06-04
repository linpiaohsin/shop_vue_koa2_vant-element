<template>
	<div>
		<div class="mainArea">
			<keep-alive>
				<router-view/>
			</keep-alive>

		</div>
		<van-tabbar v-model='active' @change='clickTabBar()'>
			<van-tabbar-item icon="hot">首页</van-tabbar-item>
			<van-tabbar-item icon="goods-collect">列表</van-tabbar-item>
            <van-tabbar-item icon="shopping-cart">购物车</van-tabbar-item>
            <van-tabbar-item icon="manager" info="1">个人中心</van-tabbar-item>
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
			changeTabBar(){
				let path = this.$route.path
				if(path == '/cart'){
					this.active = 2
				}
			},
			clickTabBar() {
				console.log(this.active)
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
							if(localStorage.getItem('loginStatus')=='false'){
								this.$router.push({name : 'login'})
							}else{
								this.$router.push('personal')
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
