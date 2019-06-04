const Router = require('koa-router')
let router = new Router()
const axios = require('axios');

router.get('/', async (ctx) => {
    ctx.body = '图灵机器人测试版'
})
router.post('/chat', async (ctx) => {
    const query = ctx.request.body
    let text = query.question || '你好'
    
    let reply = await axios.post('http://www.tuling123.com/openapi/api', {
        // 备用key
        key: "49f43a72bebb4934bdb2aa6317cb113d",
        // key:'54b56a8af10a42d0932980a721483d58',
        info: text,
        userid: "12345678"
    })
        .then(response => {
            // console.log(response.data.text);
            
            ctx.body = { code: 200, message: response.data.text};

        })
        .catch(error => {
            console.log(error);
            ctx.body = { code: 500, message: 'something error' };


        });
   



})

module.exports = router