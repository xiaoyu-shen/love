const mongoose = require('mongoose')
const md5 = require('blueimp-md5')
// 文档描述规则
//请求回来的格式（postman可以看到）
const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    name: { type: String, require: true },
    password: { type: String, require: true },
    phone: String,
    create_time: { type: Number, default: Date.now },
    role_id: String
})

const UserModel = mongoose.model('users', userSchema)

UserModel.findOne({ username: 'admin' }).then(user => {
    if (!user) {
        UserModel.create({ username: 'admin', password: md5('admin') }).then(user => {
            console.log('初始化用户：用户名：admin 密码：admin');
        })
    }
})

module.exports = UserModel