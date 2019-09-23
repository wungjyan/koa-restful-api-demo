const Koa = require('koa')
const path = require('path')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const registerRouter = require('./routes')
const app = new Koa()
const port = 3000
// 'mongodb+srv://wj:wj123456@zhihu-n2bs5.mongodb.net/test?retryWrites=true&w=majority'
const DB_URL = 'mongodb://localhost:27017/zhihu'
mongoose.connect(
  DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log('连接数据库失败：', err)
    } else {
      console.log('------连接数据库成功！------')
    }
  }
)

app.use(koaStatic(path.join(__dirname, 'public')))

// 异常处理
app.use(
  error({
    postFormat: (e, { stack, ...obj }) =>
      process.env.NODE_ENV === 'production' ? obj : { stack, ...obj } // 生产环境不响应stack
  })
)
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'),
      keepExtensions: true // 保留拓展名
    }
  })
)
// 参数验证中间件
app.use(parameter(app))
// 注册所有路由
registerRouter(app)

app.listen(port, () => {
  console.log(`服务已经启动：http://localhost:${port}`)
})
