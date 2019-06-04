<template>
  <div>
    <div class="search-bar">
      <van-row>
        <van-col span="3" class="iconfont icon">
          <span @click="gotoCity">
            <van-icon name="map-marked"></van-icon>
            <span style="font-size:.5rem;">{{this.$store.state.city}}</span>
          </span>
        </van-col>

        <van-col span="20">
          <!-- <input type="text" class="search-input" placeholder="查找商品"/> -->
          <van-search v-model="searchValue" placeholder="请输入搜索关键词" show-action>
            <!-- <div slot="action" @click="onSearch">搜索</div> -->
          </van-search>
        </van-col>
      </van-row>
    </div>
    <div class="swipe-area">
      <van-swipe :autoplay="3*1000">
        <van-swipe-item v-for="img in swiperPic" :key="img.goodsId">
          <img :src="img.image" class="img" @click="gotoDetail(img.goodsId)">
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="typeBar">
      <div v-for="(cate,index) in category" :key="cate.mallCategoryId" class="cateItem" >
        <img :src="cate.image" width="100%" class="cateImg" @click="pushToCategory(index)">
        {{cate.mallCategoryName}}
      </div>
      <!--  -->
    </div>

    <!--  -->
    <div class="recommand">
      <div class="reconmmand-title">最近购买</div>
      <swiper :options="swiperOption" class="goods" v-if="recommandList.length>1">
        <!-- slides -->
        <swiper-slide v-for="recommand in recommandList" :key="recommand.goodsId">
          <div class="goodsItem"  @click="gotoDetail(recommand.goodsId)">
            <img class="goodImg" v-lazy="recommand.image">
            <div class="goodsName">{{recommand.goodsName}}</div>
            <div class="goodsPrice">
              <span style="color:red">¥{{recommand.price|ResetMoney}}</span>
              <span style="color:grey">(原价¥{{recommand.mallPrice|ResetMoney}})</span>
            </div>
          </div>
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
        <!--    <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>-->
        <!--    <div class="swiper-scrollbar"   slot="scrollbar"></div>-->
      </swiper>
    </div>
    <!--  -->
    <floor-component :floorData="floorDataFloor1" :floorName="floorName.floor1"></floor-component>
    <floor-component :floorData="floorDataFloor2" :floorName="floorName.floor2"></floor-component>
    <floor-component :floorData="floorDataFloor3" :floorName="floorName.floor3"></floor-component>

    <!--  -->
    <div class="hotArea">
      <div class="goodsTitle">热卖商品</div>
      <div class="goods">
        <van-list>
          <van-row gutter="20">
            <van-col v-for="good in hotGoods" :key="good.goodsId" span="12">
              <hot-goods-component
                :goodsName="good.name"
                :goodsImage="good.image"
                :goodsPrice="good.price"
                :goodsId="good.goodsId"
              ></hot-goods-component>
            </van-col>
          </van-row>
        </van-list>
      </div>
    </div>
    <div class="paddingArea"></div>
  </div>
</template>

<script>
import { SetMoney } from "@/filters/Money.js";
import axios from "axios";
import floorComponent from "../component/floorComponent.vue";
import hotGoodsComponent from "../component/hotGoodsComponent.vue";
import url from "@/serviceApi.config.js";
export default {
  name: "shoppingMall",
  data() {
    return {
      searchValue: "",
      swiperPic: [],
      category: [],
      adver: "",
      swiperOption: {
        /* 	pagination:{ el:'.swiper-pagination'}, */
        loop: true,
        slidesPerView: 3
      },
      recommandList: [],
      floorDataFloor1: [],
      floorDataFloor2: [],
      floorDataFloor3: [],
      floorName: {},
      hotGoods: []
    };
  },
  components: {
    floorComponent,
    hotGoodsComponent
  },
  filters: {
    ResetMoney(money) {
      return SetMoney(money);
    }
  },
  mounted() {
    this.getData();
  },
  created() {
    // this.initDataBase()
  },
  methods: {
	gotoDetail(id){
		console.log(id);
		
		this.$router.push({name:'goods',params:{goodsId:id}})
	},
    pushToCategory(index) {
      this.$emit("changeTab", 1);
      // console.log('====///')
      this.$router.push({ name: "categoryList" });
    },
    getData() {
	   axios({
        url:url.getWaitReceive,
        method:'post',
        data:{
          page:this.page
        }
      }).then(response=>{
        if(response.data.message&&response.data.code==200){
           this.swiperPic = response.data.message
          
        }
      }).catch(err=>{
        console.log(err);
        
      })
      axios({
        /* easy - mock模拟接口 */
        /* url: ,  /api/index.json*/
        url: url.getShoppngMallInfo,
        method: "get"
      })
        .then(response => {
          // console.log(response)
          if (response.status == 200) {
            this.category = response.data.data.category;
            this.adver = response.data.data.advertesPicture;
            // this.swiperPic = response.data.data.slides;
            // this.recommandList = response.data.data.recommend
            this.floorName = response.data.data.floorName;
            this.floorDataFloor1 = response.data.data.floor1;
            this.floorDataFloor2 = response.data.data.floor2;
            this.floorDataFloor3 = response.data.data.floor3;
            this.hotGoods = response.data.data.hotGoods;
          }
        })
        .catch(error => {
          console.log(error);
        });
      axios({
        url: url.getFinshedOrders,
        method: "post",
        data: {
          page: this.page
        }
      })
        .then(response => {
          if (response.data.message && response.data.code == 200) {
            //  response.data.message.forEach(element => {
            //      if(element.status  == 0){
            //          this.cartInfo.push(element)
            //      }
            //  });
            this.recommandList = response.data.message;
            // this.shoppingListCount = response.data.count;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    gotoCity() {
      this.$router.push("city");
    }
  }
};
</script>

<style lang="stylus" scoped="scoped">
.search-bar, overflow hidden {
  height: 2.2rem;
  // background-color: yellow
  line-height: 2.2rem;
  overflow: hidden;

  .icon {
    margin-left: 0.4rem;
    margin-top: 0.1rem;
  }

  .search-input {
    width: 100%;
    height: 1.3rem;
    border-top: 0px;
    border-left: 0px;
    border-right: 0px;
    border-bottom: 1px solid black !important;
    background-color: yellow;
    font-size: 12px;
  }
}

.swipe-area {
  clear: both;
  overflow: hidden;

  .img {
    height: 10rem;
    width: 100%;
  }
}

.typeBar {
  overflow: hidden;
  display: flex;
  flex-direction: van-row;
  flex-wrap: nowrap;
  background-color: white;
  margin: 0 0.3rem 0.3rem 0.3rem;
  border-radius: 0.3rem;
  font-size: 14px;
}

.typeBar div {
  flex: 1;
}

.cateItem {
  padding: 0.3rem;
  font-size: 12px;
}

.adver {
  overflow: hidden;
}

.recommand {
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  border-radius: 0.5rem;
  background-color: white;
  margin-top: 0.3rem;

  .reconmmand-title {
    font-size: 0.8rem;
    margin-left: 0.2rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .goods {
    border-bottom: 1px solid #f0f0f0;

    .goodsItem {
      font-size: 12px;
      border-right: 1px solid #f0f0f0;
      text-align: center;

      .goodImg {
        width: 100%;
      }
    }
  }
}

.hotArea {
  border-radius: 0.2rem;
  overflow: hidden;
  background-color: #fff;

  .goodsTitle {
    height: 1.5rem;
    background: #f0f0f0;
    font-size: 0.8rem;
    margin-left: 0.2rem;
  }

  .goods {
    overflow: hidden;
    background-color: white;
    text-align: center;
  }
}

.paddingArea {
  height: 50px;
  line-height: 50px;
}
</style>
