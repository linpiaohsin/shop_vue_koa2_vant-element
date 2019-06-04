const Koa = require('koa')
const app = new Koa()
const mongoose = require('mongoose')
const {connect , initSchema} = require('./database/init.js')


const Router=require('koa-router')
let user = require('./appApi/user.js')
let goods = require('./appApi/goods.js')
let turing = require('./appApi/turing.js')
const koaBody = require('koa-body');
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024    
    }
}))
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

const cors = require('koa-cors')
app.use(cors())



//装载子路由
let router = new Router()
router.use('/user',user.routes())
router.use('/goods',goods.routes())
router.use('/turing',turing.routes())

//加载路由中间件
app.use(router.routes())
app.use(router.allowedMethods())



;(async()=>{
	await connect()
	initSchema()
// 	const User = mongoose.model('User')
// 	
// 	let user1 = new User({userName:'lin11',password:'123456'})
// 	user1.save().then(()=>{
// 		console.log('插入成功')
// 	})
// 	/* 查看数据 */
// 	let use =await User.findOne({}).exec()
// 	console.log('-------------------')
// 	console.log(use)
// 	console.log('-------------------')
})()


app.use(async(ctx) => {
	ctx.body = 'hello ddddkoa2!'
})
app.listen(3000,()=>{
	console.log('server port 3000')
})





/* async function test(){
	return 'koa2_async'
}
let result = test()
console.log(test()) */
//ctx上下文对象
/* const Koa = require('koa')
const app = new Koa()
app.use(async(ctx)=>{
	let url = ctx.url
	let text = ctx.query
	ctx.body = {
		url,
		text
	}
})
app.listen(3000,()=>{
	console.log('server port 3000')
}) */