const mongoose = require('mongoose')
//model是用来写规则的

const classSchema = new mongoose.Schema({
    name: { type: String, require: true },
    teacher_id: { type: String, require: true },
    manager_id: { type: String, require: true }

})

const ClassModel = mongoose.model('classs', classSchema)



module.exports = ClassModel