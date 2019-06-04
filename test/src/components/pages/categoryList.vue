<template>
	<div>
		<div class="nax">
			<van-nav-bar
			title='类别列表'
			/>
		</div>
		<div class="body">
			<van-row>
				<van-col span='6'>
					<div id="leftBar">
						<ul>
							<li

							 v-for="(item,index) in categoryList"
							:key = "index"
							@click="clickCategory(index,item.ID)"
							:class="{categoryActive:cateIndex==index}"
							>
								{{item.MALL_CATEGORY_NAME}}
							</li>
						</ul>
					</div>
				</van-col>
				<van-col span='18'>
					<div class="categorySubList">
						<van-tabs v-model="active" @click="clickCategorySub">
							<van-tab v-for='item in categorySubList' :title='item.MALL_SUB_NAME' :key='item.ID'>

							</van-tab>
						</van-tabs>

					</div>
					<div id="goodsList">
            <van-pull-refresh v-model = 'isRefresh' @refresh = 'onRefresh'>
              <van-list
                v-model='loading'
                :finished='finished'
                @load = 'onload'>
                <div class="itemList" v-for="(item,index) in goodsList" :key='index' @click="goGoodsDetail(item.ID)">
                  <div class="imgList">
                    <img :src="item.IMAGE1" width="100%" :onerror="errImg">
                  </div>
                  <div class="textList">
                    <div>{{item.NAME}}</div>
                    <div>¥{{item.ORI_PRICE|resetMoney}}</div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>


					</div>

				</van-col>
			</van-row>
		</div>
	</div>
</template>

<script>
	import {list,PullRefresh} from 'vant'
	import axios from 'axios'
	import url from '@/serviceApi.config.js'
  import {SetMoney} from '@/filters/Money.js'
	export default {
		name:'categoryList',
		data() {
			return {
				categoryList:[],
				cateIndex:0,
				categorySubList:[],
        active:0,
				loading:false,//上拉加载
				finished:false,//上拉加载
        isRefresh:false,//下拉刷新
        page:1,
        goodsList:[],
        categorySubId:'',
        errImg:'this.src="'+ require('@/assets/img/errorimg.png')+'"',

			};
		},
		methods: {
//		  获取一级菜单
			getCategory() {
				axios({
					url:url.goodsCategory,
					method:'get'
				}).then(response=>{
					if(response.data.message&&response.data.code == 200){
						// console.log(response)
						this.categoryList = response.data.message
						this.getCategorySubById(this.categoryList[0].ID)
            this.onload()


					}else{
						console.log('服务器错误，获取不到数据')
					}
				}).catch(err=>{
					console.log(err)
					Toast.false('服务器错误，数据获取失败')
				})
			},
//      点击一级菜单触发事件
			clickCategory(index,id){
				this.cateIndex = index
				this.page= 1
				this.goodsList =[]
				this.finished = false

				this.getCategorySubById(id)
			},
//      获取二级菜单
			getCategorySubById(categoryId){
				axios({
					url:url.goodsCategorySub,
					method:'post',
					data:{categoryId:categoryId}
				}).then(response=>{
					if(response.data.code == 200&&response.data.message){
						this.categorySubList = response.data.message
            this.active = 0
            this.categorySubId = this.categorySubList[0].ID
            this.onload()
					}
//					console.log(response)
				}).catch(err=>{
					console.log(err)
				})
			},
			/* 下拉刷新 */
			onload(){
				setTimeout(()=>{
					this.categorySubId = this.categorySubId?this.categorySubId:this.categorySubList[0].ID
          this.getGoodList()
				},1000)
			},
      onRefresh(){
			  setTimeout(()=>{
			   this.isRefresh = false
				this.finished = false
				this.goodsList= []
				this.page = 1
				this.onload()
        },500)
      },
//      获取商品列表
      getGoodList(){
        axios({
          url:url.getGoodsBySubId,
          method:'post',
          data:{
            categorySubId:this.categorySubId,
            page:this.page
          }
        }).then(response=>{
          if(response.data.message.length&&response.data.code ==200){
            this.goodsList = this.goodsList.concat(response.data.message)
          }else {
            this.finished = true
            console.log('数据获取出现问题')
          }
//          console.log(this.page)
          this.loading=false
        }).catch(err=>{
          console.log(err)
        })
      },
//      点击二级菜单触发事件
      clickCategorySub(index,title){
        this.categorySubId = this.categorySubList[index].ID
        console.log(this.categorySubId)

        this.goodsList = []
        this.finished = false
        this.page  = 1
        this.onload()
      },
//      进入详情页面
      goGoodsDetail(id){
        this.$router.push({name:'goods',params:{goodsId:id}})
      }

		},
		created(){
			this.getCategory()

		},
    filters:{
		  resetMoney(value){
       return SetMoney(value)
      }
    },
		mounted(){
			let winHeight = document.documentElement.clientHeight
			document.getElementById('leftBar').style.height=winHeight - 46 - 50+'px'
			document.getElementById('goodsList').style.height=winHeight - 90 - 50+'px'

		}
	}
</script>

<style lang="stylus" scoped="scoped">
  #leftBar ul li
    line-height 2rem
    border-bottom 1px solid #E4E7ED
    padding .2rem
    font-size .8rem
    text-align center
  .categoryActive
    background-color: #fff
  #goodsList
    overflow scroll
  .itemList
    display  flex
    flex-direction row
    font-size .8rem
    border-bottom 1px solid #ffffff
    background #fff
    .imgList
      flex 8
    .textList
      flex 16
      margin-bottom 0



</style>
