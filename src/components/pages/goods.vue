<template>
  <div>
    <div class="nav">
      <van-nav-bar titile="商品详情" left-text="返回" left-arrow @click-left="onclickeLft"/>
    </div>
    <div class="imgDiv">
      <img v-lazy="goodsInfo.IMAGE1" width="100%">
    </div>
    <div class="goodsName">{{goodsInfo.NAME}}</div>
    <div class="goodsPrice">价格¥{{goodsInfo.PRESENT_PRICE|resetMoney}}</div>
    <div class="tabs">
      <van-tabs swipeable sticky>
        <van-tab title="商品详情">
          <div class="detail" v-html="goodsInfo.DETAIL"></div>
        </van-tab>
        <van-tab title="评论">待完善</van-tab>
      </van-tabs>
    </div>
    <div class="bottom">
      <!-- <div @click='gotoMart'>			<van-button type='primary' size='large' >加入购物车</van-button></div>
      <div><van-button type='danger' size='large'>直接购买</van-button></div>-->
      <!-- vansku -->
      <van-goods-action>
        <van-goods-action-mini-btn icon="chat-o" text="客服" @click="onClickMiniBtn"/>
        <van-goods-action-mini-btn icon="cart-o" text="购物车" @click="goCart" :info="cartCount"/>
        <van-goods-action-big-btn text="加入购物车" @click="gotoMart"/>
        <van-goods-action-big-btn primary text="立即购买" @click="onClickBigBtn"/>
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import axios from "axios";
import url from "@/serviceApi.config.js";
import { SetMoney } from "@/filters/Money.js";
export default {
  name: "goods",
  data() {
    return {
      showCustomAction: true,
      goodsId: "",
      goodsInfo: {},
      cartCount: ''
    };
  },
  methods: {
    onClickMiniBtn() {
      this.$router.push("turing");
    },
    axiosGetGoodsDetail() {
      axios({
        url: url.goodDetail,
        method: "post",
        data: { goodsId: this.goodsId }
      })
        .then(response => {
          console.log(response);
          if (response.data.code == 200 && response.data.message) {
            this.goodsInfo = response.data.message;
          }
        })
        .catch(err => {
          console.log(err);
        });

      let cart = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo) : [];
      cart.forEach(element => {
        if (element.goodsId == this.goodsId) {
          this.cartCount=element.count
		}
	  });
	  
    },
    onclickeLft() {
      this.$router.go(-1);
    },
    goCart() {
      this.$router.push("cart");
    },
    //添加至购物车
    gotoMart() {
      let cart = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo) : [];
      let haveGoods = cart.find(cart => cart.goodsId == this.goodsId);
      // console.log(this.goodsId)
      console.log("haveGoods :" + haveGoods);
      if (!haveGoods) {
        console.log("gotoMart() :" + cart);
        let newCart = {
          goodsId: this.goodsInfo.ID,
          name: this.goodsInfo.NAME,
          price: this.goodsInfo.PRESENT_PRICE,
          image: this.goodsInfo.IMAGE1,
          count: 1
        };

        console.log(newCart);
        if(localStorage.getItem('loginStatus')=='true'){
            cart.push(newCart);
            localStorage.cartInfo = JSON.stringify(cart);
            Toast.success("添加成功");
        }else{
          Toast('请先登录!')
        }
        
        // setTimeout(()=>{
        // 	this.$router.push('cart')
        // },1000)
      } else {
         if(localStorage.getItem('loginStatus')=='true'){
            cart.forEach(element => {
            if (element.goodsId == this.goodsId) {
              element.count++;
            }
            });
            localStorage.cartInfo = JSON.stringify(cart);
            Toast.success("再添加成功");
         }else{
           Toast('请先登录!')
         }
         
	  }
	  this.axiosGetGoodsDetail()
    }
  },
  mounted() {
    this.axiosGetGoodsDetail();
  },
  created() {
    this.goodsId = this.$route.query.goodsId
      ? this.$route.query.goodsId
      : this.$route.params.goodsId;
    console.log(this.goodsId + " " + url.goodDetail);
  },
  filters: {
    resetMoney(value) {
      return SetMoney(value);
    }
  }
};
</script>

<style lang="stylus" scoped="scoped">
.detail {
  font-size: 0;
}

.bottom {
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.bottom>div {
  flex: 1;
  padding: 0.1rem;
}
</style>
