const mongoose = require("mongoose")
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },//姓名 
    gender: { type: String, required: true },//性别 
    school: { type: String },//学校 
    major: { type: String },//专业 
    grade: { type: String },//年级 
    education: { type: String },//学历 
    direction: { type: String, required: true },//学习方向 
    id_number: { type: String },//身份号码
    phone: { type: String, required: true },//电话号码 
    parent: { type: String },//家长姓名 
    parent_phone: { type: String, required: true },//家长联系电话 
    address: { type: String },//家庭住址 
    qq: { type: String },//QQ号码 
    class: { type: String, required: true },//所在班级 
    addmission_date: { type: String },//入学时间 
    teacher_id: { type: String, required: true },//教师id 
    manager_id: { type: String, required: true },//学管id 
    pictures: { type: Array },//照片数组 
    note: { type: String },//备注信息
})
const StudentModel = mongoose.model('students', studentSchema)
module.exports = StudentModel