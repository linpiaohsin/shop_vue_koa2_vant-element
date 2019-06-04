
const axios = require('axios');

const Koa = require('koa')
const app = new Koa()
const cors = require('koa-cors')
app.use(cors())


app.use(async (ctx, next) => {
  const query = ctx.query
  let text = query.text || '你好'
  let reply = await axios.post('http://www.tuling123.com/openapi/api', {
    key: "49f43a72bebb4934bdb2aa6317cb113d",
    info: text,
    userid: "12345678"
  })
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log(error);
      return '机器宝宝出错了'
    });
  ctx.body = reply;
});
app.listen(3000, () => {
  console.log('server port 3000')
})





