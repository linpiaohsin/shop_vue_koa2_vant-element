<template>
  <div id="container">
    <div class="header">
      <span style="float: left;margin-left:.2rem">
        <span @click="goback">
          <van-icon name='arrow-left' style="margin-left:.2rem;"></van-icon>
        </span>
        客服机器人
      </span>
      <span style="float: right;margin-right:.2rem">{{nowTime}}</span>
    </div>
    <ul class="content" style="background:white">
      <li v-for="(item, index) in messageList" :key="index">
        <img
          src="../../assets/img/null-password.jpg"
          v-if="item.isSelf"
          :class="'img'+(item.isSelf?'right':'left')"
        >
        <img src="../../assets/img/logo.jpg" v-else :class="'img'+(item.isSelf?'right':'left')">
        <span :class="'span'+(item.isSelf?'right':'left')" style="padding:.3rem">{{item.message}}</span>
      </li>
    </ul>
    <div class="footer">
      <!-- 添加输入内容 -->
      <input
        id="text"
        type="text"
        placeholder="说点什么吧..."
        v-model="inputValue"
        @keyup.enter="chat"
        
      >
      <!-- 给发送也绑定一个事件 -->
      <span id="btn" @click="chat" >发送</span>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import url from "@/serviceApi.config.js";

export default {
  data() {
    return {
      nowTime: "",
      //输入内容,双向数据绑定
      inputValue: "",
      //聊天窗口内容
      messageList: []
    };
  },
  methods: {
    goback(){
      this.$router.go(-1)
    },
    // 获取当前时间函数
    timeFormate(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =
        new Date(timeStamp).getMonth() + 1 < 10
          ? "0" + (new Date(timeStamp).getMonth() + 1)
          : new Date(timeStamp).getMonth() + 1;
      let date =
        new Date(timeStamp).getDate() < 10
          ? "0" + new Date(timeStamp).getDate()
          : new Date(timeStamp).getDate();
      let hh =
        new Date(timeStamp).getHours() < 10
          ? "0" + new Date(timeStamp).getHours()
          : new Date(timeStamp).getHours();
      let mm =
        new Date(timeStamp).getMinutes() < 10
          ? "0" + new Date(timeStamp).getMinutes()
          : new Date(timeStamp).getMinutes();
      // let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
      // return year + "年" + month + "月" + date +"日"+" "+hh+":"+mm ;
      this.nowTime =
        year + "年" + month + "月" + date + "日" + " " + hh + ":" + mm;
      // console.log(this.nowTime);
    },
    // 定时器函数
    nowTimes() {
      this.timeFormate(new Date());
      setInterval(this.nowTimes, 30 * 1000);
    },
    chat() {
      // console.log(this.inputValue);
      // 二.获取自己输入内容,将内容渲染到页面
      this.messageList.push({
        message: this.inputValue,
        isSelf: true
      });
      axios({
        url: url.chat,
        method: "post",
        data: {
          question: this.inputValue
        }
      })
        .then(response => {
          if (response.data.code == 200) {
            console.log(response.data.message);

            this.messageList.push({
              message: response.data.message,
              isSelf: false
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.inputValue = ""; //最后清除文本框
    }
  },
  activated() {

  },
  created () {
     this.nowTimes();
    
  },
  updated() {
    //  $('.content').scrollTop(9999);
  }
};
</script>

<style scoped>
#container {
  width: 100%;
  background: #eee;
  position: relative;
  box-shadow: 20px 20px 55px #777;
}

.header {
  background: #000;
  width: 100%;
  height: 2rem;
  color: #fff;
  line-height: 2rem;
  font-size: 0.8rem;
}

.footer {
  width: 100%;
  height: 2rem;
  background: #666;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content:center;
  align-items:Center;
 }

.footer input {
  width: 70%;
  height: 1.4rem;
  outline: none;
  border-radius: 0.5rem;
  font-size: 0.7rem;
}

.footer span {

  display: inline-block;
  width: 20%;
  height: 1.4rem;
  background: #ccc;
  text-align: center;
  border-radius: 0.3rem;
  margin-left: .4rem
}

.footer span:hover {
  color: #fff;
  background: #999;
}

img {
  width: 2rem;
  height: 2rem;
}

.content {
  font-size: 0.8rem;
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding-bottom: 5rem;
}

.content li {
  height: 3rem;
  width: 100%;
  display: block;
  clear: both;
}

.content li img {
  float: left;
}

.content li span {
  background: #7cfc00;
  border-radius: 0.4rem;
  float: left;
  margin: 6px 10px 0 10px;
  border: 1px solid #ccc;
  box-shadow: 0 0 3px #ccc;
}

.content li img.imgleft {
  float: left;
}

.content li img.imgright {
  float: right;
}

.content li span.spanleft {
  float: left;
  background: #fff;
}

.content li span.spanright {
  float: right;
  background: #7cfc00;
}
</style>