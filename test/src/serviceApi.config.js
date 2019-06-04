const BASEURL = 'https://www.easy-mock.com/mock/5c1b973de09a456c978d20b6/shop/'
const LOCALURL = 'http://47.107.76.115:8081/'
const CITY = 'https://www.easy-mock.com/mock/5c3095af44844e21910e8fe4/travel/city'
const URL ={
	getShoppngMallInfo : BASEURL+'index',
	registerUser:LOCALURL+'user/register',
	login:LOCALURL+'user/login',
	goodDetail:LOCALURL+'goods/getGoodsDetailInfo',
	goodsCategory:LOCALURL+'goods/getCategory',
	goodsCategorySub:LOCALURL+'goods/getCategorySub',
  getGoodsBySubId:LOCALURL+'goods/getGoodsBySubId',
	insertGoods:LOCALURL+'goods/insertAllGoodsInfo',
	insertCategory:LOCALURL+'goods/insertAllCategory',
	insertCategorySub:LOCALURL+'goods/insertAllCategorySub',
	getCity:CITY,

}
module.exports = URL
