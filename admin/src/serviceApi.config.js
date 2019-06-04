const BASEURL = 'https://www.easy-mock.com/mock/5c1b973de09a456c978d20b6/shop/'
const LOCALURL = 'http://localhost:3000/'
// const LOCALURL = 'http://47.107.76.115:3000/'
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
	insertBuyMsg:LOCALURL+'goods/insertBuy',
	changeToRefund:LOCALURL+'goods/changeToRefund',
	deleteGoods:LOCALURL+'goods/deleteGoods',
	sentGoods:LOCALURL+'goods/sentGoods',
	editGoods:LOCALURL+'goods/editGoods',
	serchGoods:LOCALURL+'goods/searchGoods',
	sureToModify:LOCALURL+'goods/sureToModify',
	uploadfile:'http://127.0.0.1:3001/upload',
	addGoods:LOCALURL+'goods/addGoods',
	getAllGoods:LOCALURL+'goods/getAllGoods',
	agreeRefundGoods:LOCALURL+'goods/agreeRefundGoods',
	getBuyMsg:LOCALURL+'goods/getBuyMsg',
	getCity:CITY,
	chat:LOCALURL+'turing/chat',

}
module.exports = URL
