// 后端应用的启动模块
// 1.通过express启动服务
// 2.通过mongoose链接数据库，只有当数据库连接成功才能启动服务
// 3.使用中间件

// 引入express
const express = require('express')
// 引入mongoose
const mongoose = require('mongoose')
// 引入body-parser
var bodyParser = require('body-parser')
// 引入path
const path = require('path')
const app = express()
// 使用中间件
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// 开放node_modules路径
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')))
// 路由器中间件文件
const indexRouter = require('./routers')
app.use('/', indexRouter)


// 通过mongoose连接数据库
mongoose.connect('mongodb://localhost/sms_server', { useNewUrlParser: true }).then(() => {
    console.log("数据库连接成功");
    app.listen('3000', () => {
        console.log("服务器启动成功，请访问http://localhost:3000");
    })
}).catch(error => {
    console.log('数据库连接失败', error);
})