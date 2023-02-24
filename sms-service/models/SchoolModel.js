const mongoose = require('mongoose')

const schoolSchema = new mongoose.Schema({
    schoolname: { type: String, require: true },
    schooltitle: { type: String, require: true },
    schoolplace: { type: String, require: true },
    schooltime: { type: String, require: true },
    schoolprincipal: { type: String, require: true },

})

const SchoolModel = mongoose.model('schools', schoolSchema)



module.exports = SchoolModel