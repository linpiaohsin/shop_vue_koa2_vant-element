const mongoose = require('mongoose')    //引入Mongoose
const Schema = mongoose.Schema          //声明Schema
let ObjectId = Schema.Types.ObjectId    //声明Object类型
const SALT_WORK_FACTOR= 10
const bcrypt = require('bcryptjs') 
const userSchema = new Schema({
    userId:ObjectId,
    userName:{unique:true,type:String},
    password:String,
    createDate:{type:Date,default:Date.now()},
    lastLoginDate:{type:Date,default:Date.now()}
})
userSchema.methods={
	comparePassword:(_pass,password)=>{
		return new Promise((resolve,reject)=>{
			bcrypt.compare(_pass,password,(err,isMatch)=>{
				if(!err) resolve(isMatch)
				else reject(err)
			})
		})
	}
}

//发布模型
mongoose.model('User',userSchema)