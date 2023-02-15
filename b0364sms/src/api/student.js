import request from '@/utils/request'

export default {
    reqDeleteImg(name) {
        return request({
            url: '/manage/img/delete',
            method: 'post',
            data: {
                name
            }
        })
    },
    getStudentAll() {
        return request({
            url: '/manage/student/all',
            method: 'get'
        })
    },
    getStudentList(page, size, searchMap) {
        return request({
            url: '/manage/student/list',
            method: 'post',
            data: {
                page,
                size,
                searchMap
            }
        })
    },
    add(student) {
        return request({
            url: '/manage/student/add',
            method: 'post',
            data: student
        })
    },
    deleteById(studentId) {
        return request({
            url: '/manage/student/delete',
            method: 'post',
            data: { studentId }
        })
    },
    update(student) {
        console.log(student)
        return request({
            url: '/manage/student/update',
            method: 'post',
            data: student
        })
    },
    getById(_id) {
        return request({
            url: `/manage/student/find?_id=${_id}`,
            method: 'get',

        })
    },
    getStudentListForMonth(year) {
        return request({
            url: '/manage/student/date',
            method: 'post',
            data: { year }
        })
    }
}