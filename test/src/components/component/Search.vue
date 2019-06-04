<template>
  <div>
    <div class="search">
      <!-- <input class="search-input" type="text" placeholder="请输入城市名或拼音" v-model="keyword"/> -->
      <van-search placeholder="请输入城市名或拼音" v-model="keyword" />

    </div>
    <div class="search-content" ref="item" v-show="keyword">
      <ul>
        <li v-for="item in list"
            class="search-item border-bottom"
            :key="item.id"
            @click="handleCityClick(item.name)">
          {{item.name}}</li>
        <li  class="search-item border-bottom" v-show="hasNoData">没有找到匹配数据</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import Bscroll from 'better-scroll'
  export default {
    name:'Search',
    props:{
      cities:Object
     },
    data(){
      return{
        keyword:'',
        list:[],
        timer:null
      }

    },
    computed:{
      hasNoData(){
        return !this.list.length
      }
    }
    ,
    watch:{
      keyword(){
        if(this.timer){
          clearTimeout(this.timer)
        }
        if (!this.keyword){
          this.list = []
          return
        }

        this.timer=setTimeout(()=>{
          const result = []
          for(let i in this.cities){
            this.cities[i].forEach((value)=>{
              if (value.spell.indexOf(this.keyword)>-1||value.name.indexOf(this.keyword)>-1){
                result.push(value)

              }

            })
          }
          this.list=result
        },100)

      }

    },
    mounted(){
      this.scroll = new Bscroll(this.$refs.item)
    },
    methods:{
      handleCityClick(city){
        this.$store.dispatch('changeCity',city)
        this.$router.push('/')
      }
    }

  }
</script>
<style lang="stylus" scoped="">
  @import "~styles/varibles.styl"
  .search
    height 1.8rem
    padding:.1rem
    .search-input
      //框内左右留有间距
      box-sizing border-box
      padding 0 .1rem
      width 100%
      height 1.8rem
      line-height 1.8rem
      text-align center
      border-radius .3rem
      color #666
  .search-content
    top 4.2rem
    left 0rem
    right 0rem
    bottom 0rem
    z-index 1
    overflow hidden
    position absolute
    background #eee
    .search-item
      line-height 1.3rem
      font-size .8rem
      padding-left .3rem
      color: #666
      background #fff
</style>
