const mongoose = require('mongoose')    //引入Mongoose
const Schema = mongoose.Schema          //声明Schema
let ObjectId = Schema.Types.ObjectId    //声明Object类型


const buySchema = new Schema({
    id:ObjectId,
    goodsId:{unique:false,type:String},
    image:{type:String},
    count:{type:Number},
    name:{type:String},
    price:{type:Number},
    status:{type:Number},
    createDate:{type:Date,default:Date.now()},
},{
	collections:'buy'
})


//发布模型
mongoose.model('Buy',buySchema)