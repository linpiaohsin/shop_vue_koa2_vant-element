const Router = require('koa-router')
let router = new Router()
const mongoose= require('mongoose')
const fs = require('fs')
const path = require('path'); // 图片路径
// sureToModify
router.post('/sureToModify',async(ctx,next)=>{

	const Goods = mongoose.model('Goods')
	let goodsMsg = ctx.request.body.goodsMsg
	console.log(goodsMsg.ID);
	
	await Goods.update({ID:goodsMsg.ID},{$set:{NAME:goodsMsg.NAME,PRESENT_PRICE:goodsMsg.PRESENT_PRICE,SUB_ID:goodsMsg.SUB_ID,IMAGE1:goodsMsg.IMAGE1,DETAIL:goodsMsg.DETAIL}},(err,raw)=>{
		if (err){
			ctx.body={code:500,message:err}
			return handleError(err);
		}
		ctx.body={code:200,message:raw}
	})

})
// searchGoods
router.post('/searchGoods',async(ctx,next)=>{

	const Goods = mongoose.model('Goods')
	let name = ctx.request.body.name
	await Goods.find({NAME:{$regex:name}}).exec().then(async(result)=>{
		ctx.body={code:200,message:result}
		console.log(result)
	}).catch(err=>{
		console.log(err)
		ctx.body={code:500,message:err}

	})

})
// edit Goods
router.post('/editGoods',async(ctx,next)=>{

	const Goods = mongoose.model('Goods')
	let id = ctx.request.body.id
	// console.log(id);
	await Goods.findOne({ID:id}).exec().then(async(result)=>{
		ctx.body={code:200,message:result}
		// console.log(result)
	}).catch(err=>{
		console.log(err)
		ctx.body={code:500,message:err}

	})

})
// delete Goods
router.post('/deleteGoods',async(ctx,next)=>{
	
	
	const Goods = mongoose.model('Goods')
	let id = ctx.request.body.id
	console.log(id);
	await Goods.remove({ID:id},(err,docs)=>{
		if(err){
			ctx.body = {
				code: 500,
				message: '删除商品失败！'
			}
		}
		ctx.body = {
			code: 200,
			message: '删除商品成功！'
			
		}
	})

})
// 添加商品
router.post('/addGoods',async(ctx,next)=>{
	
	const Goods = mongoose.model('Goods')
	console.log(ctx.request.body);
	
	let newGoods = new Goods(ctx.request.body)
	await newGoods.save().then(() => {
		ctx.body = {
			code: 200,
			message: '添加商品成功！'
		}
	}).catch(error => {
		console.log(error);
		
		ctx.body = {
			code: 500,
			message: '添加商品失败！'
		}
	})
})
// 上传图片文件
router.post('/uploadfile', async (ctx, next) => {
	// 上传单个文件
	const file = ctx.request.files.file; // 获取上传文件
	// 创建可读流
	const reader = fs.createReadStream(file.path)
	let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`
	// 创建可写流
	const upStream = fs.createWriteStream(filePath)
	// 可读流通过管道写入可写流
	console.log(filePath)
	reader.pipe(upStream)
	ctx.body = {code:200,message:"上传成功！",filePath:filePath};
  });


  
//change to refund
router.post('/changeToRefund',async(ctx)=>{
	let goodsId = ctx.request.body.goodId
	try{
		const Buy  = mongoose.model('Buy')
	    await Buy.update({_id:goodsId},{status:1}).exec()
		ctx.body={code:200,message:'refund success!'}
	}catch(err){
		ctx.body={code:500,message:err}
	}
})
router.post('/changeToFinish',async(ctx)=>{
	let goodsId = ctx.request.body.goodId
	try{
		const Buy  = mongoose.model('Buy')
	    await Buy.update({_id:goodsId},{status:4}).exec()
		ctx.body={code:200,message:'changeToFinish success!'}
	}catch(err){
		ctx.body={code:500,message:err}
	}
})
router.post('/sentGoods',async(ctx)=>{
	let goodsId = ctx.request.body.goodId
	try{
		const Buy  = mongoose.model('Buy')
	    await Buy.update({_id:goodsId},{status:2}).exec()
		ctx.body={code:200,message:'refund success!'}
	}catch(err){
		ctx.body={code:500,message:err}
	}
})
router.post('/agreeRefundGoods',async(ctx)=>{
	let goodsId = ctx.request.body.goodId
	try{
		const Buy  = mongoose.model('Buy')
	    await Buy.update({_id:goodsId},{status:3}).exec()
		ctx.body={code:200,message:'refund success!'}
	}catch(err){
		ctx.body={code:500,message:err}
	}
})

router.post('/getRefundAndRefundSuccess',async(ctx)=>{
	try{
		let page = ctx.request.body.page
		let start = (page-1)*10
		let num = 10 //每页显示10个 
		const Buy  = mongoose.model('Buy')
	
		// let result = await Buy.find({status:1}).skip(start).limit(num).exec()
		let result = await Buy.where('status').in([1,3]).sort({'_id':-1}).skip(start).limit(num).exec()
		
		let resultCount = await Buy.where('status').in([1,3]).exec()
		let count = resultCount.length
		ctx.body={code:200,message:result,count:count}
	}catch(err){
		ctx.body={code:500,message:err}
	}

})

router.post('/getAllGoods',async(ctx)=>{
	try{
		let page = ctx.request.body.page
		let start = (page-1)*10
		let num = 10 //每页显示10个 
		const Goods  = mongoose.model('Goods')
		let result = await Goods.find().sort({'_id':-1}).skip(start).limit(num).exec()
		let resultCount = await Goods.find().exec()
		let count = resultCount.length
		ctx.body={code:200,message:result,count:count}
	}catch(err){
		ctx.body={code:500,message:err}
	}

})

router.post('/getWaitSent',async(ctx)=>{
	try{
		let page = ctx.request.body.page
		let start = (page-1)*10
		let num = 10 //每页显示10个 
		const Buy  = mongoose.model('Buy')
		let result = await Buy.find({status:0}).sort({'_id':-1}).skip(start).limit(num).exec()
		let resultCount = await Buy.find({status:0}).exec()
		let count = resultCount.length
		ctx.body={code:200,message:result,count:count}
	}catch(err){
		ctx.body={code:500,message:err}
	}

})
router.post('/getFinshedOrders',async(ctx)=>{
	try{
		let page = ctx.request.body.page
		let start = (page-1)*10
		let num = 10 //每页显示10个 
		const Buy  = mongoose.model('Buy')
		let result = await Buy.find({status:4}).sort({'_id':-1}).skip(start).limit(num).exec()
		let resultCount = await Buy.find({status:4}).exec()
		let count = resultCount.length
		ctx.body={code:200,message:result,count:count}
	}catch(err){
		ctx.body={code:500,message:err}
	}

})
router.post('/getWaitReceive',async(ctx)=>{
	try{
		let page = ctx.request.body.page
		let start = (page-1)*10
		let num = 10 //每页显示10个 
		const Buy  = mongoose.model('Buy')
		let result = await Buy.find({status:2}).sort({'_id':-1}).skip(start).limit(num).exec()
		let resultCount = await Buy.find({status:2}).exec()
		let count = resultCount.length
		ctx.body={code:200,message:result,count:count}
	}catch(err){
		ctx.body={code:500,message:err}
	}

})
//get buy message
router.post('/getBuyMsg',async(ctx)=>{
	try{
		let page = ctx.request.body.page
		let start = (page-1)*10
		let num = 10 //每页显示10个 
		const Buy  = mongoose.model('Buy')
		let result = await Buy.find().sort({'_id':-1}).skip(start).limit(num).exec()
		let count = await Buy.find().exec()
		let countEvery = []
		for(let i=0;i<=5;i++){
			let countNow = await Buy.find({status:i}).exec()
			countEvery[i] = countNow.length
		}
		ctx.body={code:200,message:result,count:count,countEvery:countEvery}
	}catch(err){
		ctx.body={code:500,message:err}
	}

})
//cart to bug
router.post('/insertBuy',async(ctx)=>{
		let buyMsg = ctx.request.body.buyMsg
		const Buy  = mongoose.model('Buy')
		
		buyMsg.forEach(item => {
				let newGoods = new Buy(item)
				newGoods.save().then(()=>{
			
				
			}).catch(err=>{
				console.log(err+'插入失败')
				ctx.body={code:500,message:"插入fail"}
			})
		});
		ctx.body={code:200,message:"插入成功"}
})

router.get('/insertAllGoodsInfo',async(ctx)=>{
	fs.readFile('./newGoods.json','utf8',(err,data)=>{
		let newData = JSON.parse(data)
		let saveCount = 0
		const Goods= mongoose.model('Goods')
		newData.RECORDS.map((value,index)=>{
			// console.log(value)
			let newGoods = new Goods(value)
			newGoods.save().then(()=>{
				saveCount++
				console.log(saveCount+'插入成功')
				ctx.body="插入成功"
			}).catch(err=>{
				console.log(err+'插入失败')
				ctx.body="插入失败"
			})
		})
	})
	
})
router.get('/insertAllCategory',async(ctx)=>{
	fs.readFile('./category.json','utf8',(err,data)=>{
		let cateData =JSON.parse(data)
		let saveCount = 0
		const category = mongoose.model('category')
		cateData.RECORDS.map((value,index)=>{
			let newCate= new category(value)
			newCate.save().then(()=>{
				saveCount++
				console.log(saveCount+'插入成功')
			}).catch(err=>{
				console.log(err+'插入失败')
			})

		})
	})
	ctx.body='开始插入category数据'
})
router.get('/insertAllCategorySub',async(ctx)=>{
	fs.readFile('./category_sub.json','utf8',(err,data)=>{
		let cateData =JSON.parse(data)
		let saveCount = 0
		const categorySub = mongoose.model('categorySub')
		cateData.RECORDS.map((value,index)=>{
			let newCate= new categorySub(value)
			newCate.save().then(()=>{
				saveCount++
				console.log(saveCount+'插入成功')
			}).catch(err=>{
				console.log(err+'插入失败')
			})

		})
	})
	ctx.body='开始插入categorySub数据'
})
//商品详情查询接口
router.post('/getGoodsDetailInfo',async(ctx)=>{
	let goodId= ctx.request.body.goodsId
	const goods = mongoose.model('Goods')
	console.log('执行商品详情查询')
	await goods.findOne({ID:goodId}).exec().then(async(result)=>{
		ctx.body={code:200,message:result}
		console.log(result)
	}).catch(err=>{
		console.log(err)
		ctx.body={code:500,message:err}

	})


})
//读取大类Api
router.get('/getCategory',async(ctx)=>{
	try{
		const category  = mongoose.model('category')
		let result = await category.find().exec()
		ctx.body={code:200,message:result}
	}catch(err){
		ctx.body={code:500,message:err}
	}
})

/* xiaolei api */
router.post('/getCategorySub',async(ctx)=>{
	try{
		let categoryId = ctx.request.body.categoryId
		// let categoryId =1
		const categorySub  = mongoose.model('categorySub')
		let result = await categorySub.find({MALL_CATEGORY_ID:categoryId}).exec()
		ctx.body={code:200,message:result}
	}catch(err){
		ctx.body={code:500,message:err}
	}
})
/* leibie api */
router.post('/getGoodsBySubId',async(ctx)=>{
	try{
	 	let categorySubId = ctx.request.body.categorySubId
		let page = ctx.request.body.page
		let start = (page-1)*10
		let num = 10 //每页显示10个


		const goods  = mongoose.model('Goods')
		let result = await goods.find({SUB_ID:categorySubId}).skip(start).limit(num).exec()
		ctx.body={code:200,message:result}
	}catch(err){
		ctx.body={code:500,message:err}
	}
})
module.exports=router
