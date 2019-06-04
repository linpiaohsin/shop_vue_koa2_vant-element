<template>
  <div>
    <van-nav-bar title="购物车"></van-nav-bar>
	<div style="background:white;text-align:right;height:1.3rem">
	 <van-button type="primary" @click="selectAll"> 
      <van-icon name="wechat">全选</van-icon>
     </van-button>
	 <van-button type="danger" @click="clearCart">
      <van-icon name="clear">清空</van-icon>
     </van-button>
	</div>
 
    <van-checkbox-group class="card-goods" v-model="checkedGoods" style="margin-bottom:4rem">
      <van-checkbox
        ref="checkBoxs"
        class="card-goods__item"
        v-for="(item,index) in cartInfo"
        :key="index"
        :name="item.goodsId"
      >
      
        <van-card
          :title="item.name"
          :desc="desc"
          :num="item.count"
          :price="item.price*item.count|resetMoney"
          :thumb="item.image"
          tag="热卖"
        />
      </van-checkbox>
      
      <div v-if="showTips" style="text-align:center;margin-top:2rem">
        <p style="color:grey;font-size:1.2rem">竟然是空的！</p>
        <p style="color:grey;font-size:0.9rem">再忙，也要买点犒劳自己~</p>
      </div>
      
    </van-checkbox-group>
    <van-submit-bar
      style="margin-bottom:2.5rem"
      :price="totalMoney*100"
      :disabled="!checkedGoods.length"
      :button-text="submitBarText"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Card, SubmitBar, Toast } from "vant";
import { SetMoney } from "@/filters/Money.js";
import url from '@/serviceApi.config.js'
import axios from 'axios';
import { setTimeout } from 'timers';
export default {
  components: {
    [Card.name]: Card,
    [Checkbox.name]: Checkbox,
    [SubmitBar.name]: SubmitBar,
    [CheckboxGroup.name]: CheckboxGroup
  },
  activated() {
    this.getCartInfo();
    // localStorage.removeItem('cartInfo')
  },
  filters: {
    resetMoney(value) {
      return SetMoney(value);
    }
  },
  data() {
    return {
      selectStatus:true,
      desc: "a healthy food !",
      cartInfo: [],
      isEmpty: false,
      checkedGoods: [],
      checked:true,
      showTips:false
    };
  },
  computed: {
    totalMoney() {
      // let totalMoney = 0
      // this.cartInfo.forEach((item)=>{
      // 	totalMoney +=item.price*item.count
      // })
      // localStorage.cartInfo = JSON.stringify(this.cartInfo)
      // return totalMoney
      return this.cartInfo.reduce(
        (total, item) =>
          total +
          (this.checkedGoods.indexOf(item.goodsId) !== -1 ? item.price*item.count : 0),
        0
      );
    },
    submitBarText() {
      const count = this.checkedGoods.length;
      return "结算" + (count ? `(${count})` : "");
    }
  },
  methods: {
	clearCart(){
    localStorage.removeItem('cartInfo')
    Toast('清除购物车成功！')
    setTimeout(()=>{
      location.reload()
    },600)

	},
	selectAll(){
      console.log(this.$refs.checkBoxs.value);
      
      // this.$refs.checkBoxs.toggle()
	},
  onSubmit() {
      
     if(localStorage.getItem('loginStatus')=='true'){
        let buyList = []
        console.log(this.cartInfo);
        this.checkedGoods.forEach(id=>{
          for(let i=0;i<this.cartInfo.length;i++){
              if(this.cartInfo[i].goodsId == id){
              buyList.push(this.cartInfo[i])
              this.cartInfo.splice(i,1)
            }
          }
        })
        // console.log('buy  == ',buyList);
        // console.log('leave  == ',this.cartInfo);
        
        axios({
          url:url.insertBuyMsg,
          method:'post',
          data:{buyMsg:buyList}
        }).then(response=>{
          if(response.data.code == 200){
            Toast("支付成功（暂未集成支付接口）");
          }else{
            Toast("支付失败");
          }
        }).catch(err=>{
          console.log(err);
          
        })
        
        localStorage.cartInfo = JSON.stringify(this.cartInfo)
        this.getCartInfo()
     }else{
       Toast('请先登录！')
     }
      
  },
    getCartInfo() {
      if (localStorage.cartInfo&&localStorage.getItem('loginStatus')=='true') {
        this.cartInfo = JSON.parse(localStorage.cartInfo);
        this.cartInfo.forEach(item=>{
          item.status = 0
        })
        this.showTips = false
      }else{
        this.showTips = true
      }
    //   console.log(JSON.stringify(this.cartInfo));
      this.isEmpty = this.cartInfo.length > 0 ? true : false;
    },
    
  }
};
</script>

<style lang="less">
.card-goods {
  padding: 10px 0;
  background-color: #fff;
  &__item {
    position: relative;
    background-color: #fafafa;
    .van-checkbox__label {
      width: 100%;
      height: auto; // temp
      padding: 0 10px 0 15px;
      box-sizing: border-box;
    }
    .van-checkbox__icon {
      top: 50%;
      left: 10px;
      z-index: 1;
      position: absolute;
      margin-top: -10px;
    }
    .van-card__price {
      color: #f44;
    }
  }
}
</style>