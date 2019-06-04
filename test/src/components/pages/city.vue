<template>
  <div>
    <city-header></city-header>
		<search :cities="cities" ></search>
		<list style="margin-top:.5rem"
          :cities="cities"
          :hotCities="hotCities"
          :letter="letter"></list>
    <city-alphabet :cities="cities" @change="handleChange"></city-alphabet>
  </div>


</template>
<script>
	import url from '@/serviceApi.config.js'
  import axios from 'axios'
  import CityAlphabet from '../component/Alphabet.vue'
  import CityHeader from '../component/CityHeader'
  import Search from '../component/Search'
  import List from '../component/List'
  export default {
    name:'city',
    components:{
      CityHeader,
      Search,
      List,
      CityAlphabet
    },
    data(){
      return {
        cities:{},
        hotCities:[],
        letter:'',

      }
    },

    methods:{
      getCityInfo(){
        axios({
          url:url.getCity,
          method:'get'
        }).then(this.handleGetCityInfoSuc)
      },
      handleGetCityInfoSuc(res){
        res=res.data;
        if(res.ret&&res.data){
          const data=res.data
          this.cities=data.cities
          this.hotCities=data.hotCities
        }

      },
      handleChange(e){
        this.letter=e

      }

    }
    ,
    mounted(){
      this.getCityInfo()
    }
  }
</script>
<style lang="stylus" scoped="">

</style>
