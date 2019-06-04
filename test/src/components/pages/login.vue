<template>
  <div>
    <van-nav-bar title="XX生鲜超市 登录page"/>
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
        <van-row>
          <van-col :span="12">
            <drag-verify
              :width="width"
              :height="height"
              :text="text"
              :success-text="successText"
              :text-size="textSize"
              @passcallback="slideFinish"
            ></drag-verify>
          </van-col>
          <van-col :span="12">
            <van-checkbox checked-color="#07c160"
              v-model="remeberPwdStatus"
              class="remeberpwdRight">记住密码</van-checkbox>
          </van-col>
        </van-row>
      </div>
      <div class="registerBtn">
        <van-button size="large" type="primary" @click="loginAction()" >登录</van-button>
      </div>
      <div>
        <p class="registerTip"><router-link to="register">还没有账号？点击我去注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import dragVerify from "vue-drag-verify";
import { Toast } from "vant";
import axios from "axios";
import url from "@/serviceApi.config.js";
import { log } from "util";
export default {
  name: "login",
  data() {
    return {
      width:'240',
      height:'30',
      successText: "验证成功",
      textSize: ".8rem",
      text: "请拉到最右验证",
      remeberPwdStatus: "",
      userName: "",
      password: "",
      openLoading: false,
      usernameErrMsg: "",
      passwordErrMsg: "",
      slideFinishStatus: false
    };
  },
  components: {
    dragVerify
  },
  mounted() {},
  activated() {
    this.getUsernameAndPwd()
  },
  methods: {
    getUsernameAndPwd(){
        if(this.$cookies.get('status')){
          this.userName=this.$cookies.get('username')
          this.password=this.$cookies.get('password')
        }

        
       
      
    },
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
    axiosLogin() {
      this.openLoading = true;
      axios({
        url: url.login,
        method: "post",
        data: {
          userName: this.userName,
          password: this.password
        }
      })
        .then(response => {
          if (response.data.code == 200 && response.data.message == true) {
            new Promise((resolve, reject) => {
              localStorage.setItem('loginStatus',true)

              if(this.remeberPwdStatus){
                  this.$cookies.set('username',this.userName)
                  this.$cookies.set('password',this.password)
                  this.$cookies.set('status',true)
              }else{
                  this.$cookies.remove('username')
                  this.$cookies.remove('password')
                 
                  this.$cookies.set('status',false)
              }
            
                setTimeout(() => {
                  resolve();
                }, 500);
            })
              .then(() => {
                Toast.success("登录成功");
                this.$router.push("personal");
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            Toast.fail("密码错误!");
            this.openLoading = false;
          }
          console.log(response);
        })
        .catch(err => {
          this.openLoading = false;
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
    //真正的登录方法
    loginAction() {
      // console.log(this.slideFinishStatus);

      if (!this.slideFinishStatus) {
        Toast.fail("滑块未验证");
      }
      if (this.checkForm() == true && this.slideFinishStatus) {
        this.axiosLogin();
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
