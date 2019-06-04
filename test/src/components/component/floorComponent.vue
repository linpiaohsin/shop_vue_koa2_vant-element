<template>
	<div class="floor">
		<div class="floorName">{{floorName}}</div>
		<div class="firstFloor" >
			<div class="floorLeft"> 
				<img :src="floor1Left.image" width="100%"/>
			</div>
			<div class="floorRight">
				<div class="floorRight1">					<img :src="floor1Right1.image" width="100%"/></div>
				<div class="floorRight2">					<img :src="floor1Right2.image" width="100%"/></div>
			</div>
		</div>
	
		<div class="normalFloor" >
			<div class="normalItem" v-for="img in floor1.slice(3)" :key="img.goodsId">
				<img :src="img.image" width="100%"/>
			</div>
		</div>
	</div>
	
</template>

<script>
	export default {
		name : 'floorComponent',
		data() {
			return {
				floor1:[],
				floor1Left:{},
				floor1Right1:{},
				floor1Right2:{},

			};
		},
		props:['floorData','floorName'],
		watch:{
			floorData(){
				this.floor1 = this.floorData
				this.floor1Left = this.floorData[0]
				this.floor1Right1 = this.floorData[1]
				this.floor1Right2 = this.floorData[2]
			}
		}
	}
</script>

<style lang="stylus" scoped="scoped">
	.floor
	 overflow hidden	
	 border-bottom 1px solid #f0f0f0
	 border-radius .5rem
		.firstFloor
			display flex
			flex-direction row
			background-color white
			.floorLeft
				border-right 1px solid #f0f0f0
				border-bottom 1px solid #f0f0f0
			.floorRight
				border-bottom 1px solid #f0f0f0
				.floorRight1
					border-bottom 1px solid #f0f0f0
		.normalFloor
			border-bottom 1px solid #f0f0f0
			display flex
			flex-direction row
			flex-wrap wrap
			.normalItem
				width 50%
				border-right 1px solid #f0f0f0
				box-sizing border-box
		.floorName
			text-align left
			color red
			font-size .8rem
			border-bottom 1px solid #f0f0f0

</style>
