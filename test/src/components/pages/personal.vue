<template>
  <!-- <div class="totalArea">
		<div class="personHeader" v-if='isLogin'>
		
			<div class="imgArea">
				<img src="../../assets/img/timg.jpg" width="100%" />
			
			</div >
			<div class="personName">
				{{userName}}
				
			</div>
		</div>
		<div v-else class="unLogin">
			<div class="tip">您还未登录，请登录~</div>
			<div class="btns">
				<van-button round type="primary" @click='login'>登录</van-button>
				<van-button round type="danger" @click='register'>注册</van-button>
			</div>
		</div>
  </div>-->
  <div>
    <div style="display:flex;padding:.2rem">
      <div style="font-size:.8rem;margin: 0 auto;">
        个人中心
      </div>
      <div class="settingIcon">
        <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <van-icon name="setting-o" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>收货地址</el-dropdown-item>
          <el-dropdown-item><span @click="login">退出</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      </div>
    </div>

    <div>
      <img class="user-poster" src="../../assets/img/background.jpg">
      <van-row class="user-links">
        <van-col span="5">
          <van-icon name="pending-payment"/>待付款
        </van-col>
        <van-col span="5">
          <van-icon name="logistics"/>待发货
        </van-col>
        <van-col span="5">
          <van-icon name="certificate"/>待收货
        </van-col>
        <van-col span="4">
          <van-icon name="thumb-circle-o"/>待评价
        </van-col>
        <van-col span="5">
          <van-icon name="gold-coin-o"/>退款/售后
        </van-col>
      </van-row>

      <van-cell-group class="user-group">
        <van-cell icon="records" title="全部订单" is-link/>
      </van-cell-group>

      <van-cell-group>
        <van-cell icon="exchange" title="我的积分" is-link/>
        <van-cell icon="gold-coin" title="我的优惠券" is-link/>
        <van-cell icon="gift" title="我收到的礼物" is-link/>
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

export default {
  name: "personal",
  data() {
    return {
      userName: "hhh",
      isLogin: false
    };
  },
  mounted() {
    // if(localStorage.userName){
    // 	this.isLogin = true
    // 	this.userName = localStorage.userName
    // }
  },
  methods: {
    login() {
      this.$router.push("login");
      localStorage.setItem('loginStatus',false)
      
      // this.$cookies.remove('username')
      
    },
    register() {
      this.$router.push("register");
    }
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
