<template>
  <div>
    <van-nav-bar title="XX生鲜超市 注册page"/>
    <van-notice-bar text="欢迎使用XXX生鲜超市移动端，新注册用户首单享受XXXXXX" left-icon="volume-o"/>
    <div class="registerPanel">
      <van-field
        v-model="userName"
        label="用户名"
        placeholder="请输入用户名"
        icon="clear"
        required
        @click-icon="cleanUserName"
        :error-message="usernameErrMsg"
      />
      <van-field
        v-model="password"
        label="密码"
        placeholder="请输入密码"
        type="password"
        icon="clear"
        required
        @click-icon="cleanPassword()"
        :error-message="passwordErrMsg"
      />
      <div class="remeberArea">
        <!-- :background="background" 
             :progress-bar-bg="progressBarBg" 
             :completed-bg="completedBg" 
             :handler-bg="handlerBg" 
             :handler-icon="handlerIcon" 
             :success-icon="successIcon" 
        :circle="getShape"-->
       
            <drag-verify
              :width="250"
              :height="30"
              :text="text"
              :success-text="successText"
              :text-size="textSize"
              @passcallback="slideFinish"
            ></drag-verify>
         
      </div>
      <div class="registerBtn">
			<van-button size= 'large' type='primary' @click="registAction()" >立即注册</van-button>
      </div>
  
    </div>
  </div>
</template>

<script>
import dragVerify from "vue-drag-verify";

import { Toast } from "vant";
import axios from "axios";
import url from "@/serviceApi.config.js";
import { setTimeout } from 'timers';
export default {
  name: "register",
  data() {
    return {
      userName: "",
      password: "",
      openLoding: false /* 防止用户重复提交 */,
      usernameErrMsg: "",
      passwordErrMsg: "",
	  successText: "验证成功",
      textSize: ".8rem",
      text: "请拉到最右验证",
      remeberPwdStatus: "",
      slideFinishStatus: false
    };
  },
  components: {
    dragVerify
  },
  mounted() {},
  methods: {
	  //滑块验证
    slideFinish() {
      this.slideFinishStatus = true;
    },
    goback() {
      this.$router.go(-1);
    },
    cleanUserName() {
      this.userName = null;
    },
    cleanPassword() {
      this.password = null;
    },
    axiosRegisterUser() {
      this.openLoding = true;
      axios({
        url: url.registerUser,
        method: "post",
        data: {
          userName: this.userName,
          password: this.password
        }
      })
        .then(response => {
          if (response.data.code == 200) {
			Toast.success(response.data.message);
			setTimeout(()=>{
            this.$router.push("login");

			},500)
          } else {
            Toast.fail(response.data.message);
            console.log(response.data.message);
            this.openLoding = false;
          }
          console.log(response.data.code);
        })
        .catch(err => {
          Toast.fail(response.data.message);
          this.openLoding = false;
          console.log(err);
        });
    },
    checkForm() {
      let isOk = true;
      if (this.userName.length < 3) {
        this.usernameErrMsg = "用户名不得少于3位";
        isOk = false;
      }
      if (this.password.length < 3) {
        this.passwordErrMsg = "密码不得少于3位";
        isOk = false;
      }
      return isOk;
    },
    //真正的注册方法
    registAction() {
	  if (!this.slideFinishStatus) {
        Toast.fail("滑块未验证");
      }
      if (this.checkForm() == true&& this.slideFinishStatus) {
        this.axiosRegisterUser();
      }
      //&&
    }
  }
};
</script>

<style lang="stylus" scoped="scoped">
.registerPanel 
  margin-top 5rem
  padding: 0.4rem 0.2rem;
  background: #f0f0f0;

  .registerBtn 
    margin-top: 0.5rem;
  

  .remeberArea 
    text-align: right;
    margin-top: 0.5rem;
    font-size: 0.8rem;

    .remeberpwdRight 
      margin-right: 0.5rem;
      margin-top: 0.3rem;
  .registerTip
    font-size .6rem
    background #f0f0f0
    text-align right 
    padding-bottom 15rem
    color skyBlue
</style>
