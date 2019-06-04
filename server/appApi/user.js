const Router = require('koa-router')
let router = new Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const saltVal = 10
router.get('/', async (ctx) => {
	ctx.body = '这是用户首页'
})
router.post('/register', async (ctx) => {
	const User = mongoose.model('User')
	let newUser = new User(ctx.request.body)
	console.log(newUser.password)
	//为password加盐并加密
	const password = bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(saltVal))
	newUser.password = password
	await newUser.save().then(() => {
		ctx.body = {
			code: 200,
			message: '注册成功'
		}
	}).catch(error => {
		ctx.body = {
			code: 500,
			message: '注册失败'
		}
	})
})
router.post('/login', async (ctx) => {
	let loginUser = ctx.request.body
	let userName = loginUser.userName
	let password = loginUser.password
	const User = mongoose.model('User')
	await User.findOne({ userName: userName }).exec().then(async (result) => {

		if (result) {
			//当用户名存在时，开始比对密码
			let newUser = new User()  //因为是实例方法，所以要new出对象，才能调用
			await newUser.comparePassword(password, result.password)
				.then((isMatch) => {
					//返回比对结果
					console.log(result.__v)
					if(result.__v == 1){
						// 管理员通道
						console.log('finish')
						ctx.body = { code: 100, message: isMatch }
					}else{
					console.log('fail!')
					ctx.body = { code: 200, message: isMatch }
					}
					
				})
				.catch(error => {
					console.log(error)
					ctx.body = { code: 500, message: error }
				})
		} else {
			ctx.body = { code: 200, message: '用户名不存在' }
		}
	}).catch(error => {
		console.log(error)
		ctx.body = { code: 500, message: error }
	})
})

module.exports = router