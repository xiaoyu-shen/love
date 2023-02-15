import request from '@/utils/request'

export default {
    getRolelist() {
        return request({
            url: '/manage/role/list',
            method: 'get'
        })
    },
    addRole(name) {
        return request({
            url: '/manage/role/add',
            method: 'post',
            data: {
                name
            }
        })
    },
    updateRole(role) {
        return request({
            url: '/manage/role/update',
            method: "post",
            data: role
        })
    }
}