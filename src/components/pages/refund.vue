<template>
  <div>
    <van-nav-bar title="退款订单" left-arrow="" 
    left-text="返回"
    @click-left="onClickLeft"/>
    <van-checkbox-group class="card-goods" v-model="checkedGoods" v-for="(item,index) in cartInfo" :key="index" >
        <van-card
          :title="item.name"
          :desc="item.createDate"
          :num="item.count"
          :price="item.price| resetMoney"
          :thumb="item.image"
          tag="热卖"
          :lazy-load='true'
        >
          <div slot="footer">
            
            <van-button size="mini" type="warning" v-if="item.status == 1" disabled>退款中</van-button>
            <van-button size="mini" type="primary" v-if="item.status == 3" disabled>已退款</van-button>
          </div>
        </van-card>
      
    </van-checkbox-group>
   
    <el-pagination
    width='100%'
    background
    @size-change="handleSizeChange"
    :current-page.sync="page"
    @current-change="handleCurrentChange"
    layout="prev, pager, next "
    :total="shoppingListCount">
    </el-pagination>
    <div style="height:2.6rem;background:white"></div>
  </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Card, SubmitBar, Toast } from "vant";
import { SetMoney } from "@/filters/Money.js";
import axios from 'axios'
import url from '@/serviceApi.config.js';
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
      checkedGoods:[],
      len:'',
      currentPage:'',
      desc: "a healthy food !",
      cartInfo: [],
      shoppingListCount:1,
      page:1,
      
    };
  },
  computed: {
   
   
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(this.page);
      this.getCartInfo()

    },
    onClickLeft(){
      this.$router.go(-1)
    },
   
    getCartInfo() {
      // if (localStorage.cartInfo) {
      //   this.cartInfo = JSON.parse(localStorage.cartInfo);
      // }
      // console.log(JSON.stringify(this.cartInfo));
      // this.isEmpty = this.cartInfo.length > 0 ? true : false;
      this.cartInfo = []
      axios({
        url:url.getRefundAndRefundSuccess,
        method:'post',
        data:{
          page:this.page
        }
      }).then(response=>{
        if(response.data.message&&response.data.code==200){
          //  response.data.message.forEach(element => {
          //      if(element.status  == 1){
          //          this.cartInfo.push(element)
          //      }
          //  });
          this.cartInfo = response.data.message
          this.shoppingListCount = response.data.count
        }
      }).catch(err=>{
        console.log(err);
        
      })
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