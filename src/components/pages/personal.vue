<template>
  <div>
    <div style="display:flex;padding:.2rem">
      <div style="font-size:.8rem;margin: 0 auto;">
        个人中心 - {{userName}}
      </div>
      <div class="settingIcon">
        <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <van-icon name="setting-o" />
        </span>
        <el-dropdown-menu slot="dropdown">
          
          <el-dropdown-item><span @click="login">退出</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </div>
    </div>
  
    <div>
      <img class="user-poster" src="../../assets/img/noMoney.jpg"  height="250">
      <van-row class="user-links">
        <van-col span="5">
          <van-icon name="pending-payment"/>待付款
        </van-col>
        <van-col span="4" >
          <van-icon name="logistics" @click="showWaitToSendOrders" :info="waitSendAmount" />待发货
        </van-col>
        <van-col span="5">
          <van-icon name="certificate" :info="waitToReciveAmount" @click="showWaitToReceiveOrders"/>待收货
        </van-col>
        <van-col span="5">
          <van-icon name="gold-coin-o" @click="showRefund" :info="refundAmount"/>退款/售后
        </van-col>
        <van-col span="4">
          <van-icon name="thumb-circle-o" :info="finshedAmount" @click="showFinishOrders"/>待评价
        </van-col>
        
      </van-row>

      <van-cell-group class="user-group" >
        <van-cell  @click="showAllOrders" icon="records" title="全部订单" is-link />
      </van-cell-group>

      <van-cell-group>
        <van-cell icon="exchange" title="..." is-link/>
        <van-cell icon="gold-coin" title="..." is-link/>
        <van-cell icon="gift" title="..." is-link/>
      </van-cell-group>
    </div>
    <!-- unlogin -->
    <!-- <div v-else class="unLogin">
			<div class="tip">您还未登录，请登录</div>
			<div class="btns">
				<van-button round type="primary" @click='login'>登录</van-button>
				<van-button round type="danger" @click='register'>注册</van-button>
			</div>
    </div>-->
  </div>
</template>

<script>
import { Row, Col, Icon, Cell, CellGroup } from "vant";
import axios from 'axios'
import url from '@/serviceApi.config.js';
import refundVue from './refund.vue';
export default {
  name: "personal",
  data() {
    return {
      waitSendAmount:'',
      userName: "hhh",
      isLogin: false,
      refundAmount:'',
      waitToReciveAmount:'',
      finshedAmount:''
    };
  },
  mounted() {
  
  },
  activated(){
    this.getSendAmount()
    if(localStorage.userName){
    	
    	this.userName = localStorage.userName
    }
  },
  methods: {
    showWaitToReceiveOrders(){
      this.$router.push('waitToReciveOrders')
    },
    showFinishOrders(){
      this.$router.push('finishOrders')
    },
    login() {
      this.$router.push("login");
      localStorage.setItem('loginStatus',false)
      
      // this.$cookies.remove('username')
      
    },
    showRefund(){
      this.$router.push('refund')
    },
    register() {
      this.$router.push("register");
    },
    showWaitToSendOrders(){
      this.$router.push('waitToSendOrders')
    },
    showAllOrders(){
      this.$router.push('hadBuy')
    },
    getSendAmount(){
    axios({
        url:url.getBuyMsg,
        method:'post',
        // data:{
        //   page:this.currentPage
        // }
      }).then(response=>{
        if(response.data.message&&response.data.code==200){
          let count = response.data.countEvery
          
          this.waitSendAmount = count[0]
          this.refundAmount = count[1]+count[3]
          this.waitToReciveAmount = count[2]
          this.finshedAmount = count[4]
        }
      }).catch(err=>{
        console.log(err);
        
      })
  },
  }
};
</script>

<style lang="less" scope>
.user {
  &-poster {
    width: 100%;
    display: block;
  }
  &-group {
    margin-bottom: 15px;
  }
  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    .van-icon {
      display: block;
      font-size: 24px;
    }
  }
}
</style>
