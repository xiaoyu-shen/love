const mongoose = require('mongoose')

const schoolSchema = new mongoose.Schema({
    schoolname: { type: String, require: true },

})

const SchoolModel = mongoose.model('schools', schoolSchema)



module.exports = SchoolModel