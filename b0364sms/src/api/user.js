import request from '@/utils/request'

export default {
    //获取所有用户
    getUserAll() {
        return request({
            url: '/manage/user/all',
            method: 'get'
        })
    },
    getUserList(page, size) {
        return request({
            url: '/manage/user/list',
            method: 'post',
            data: {
                page,
                size
            }
        })
    },
    add(user) {
        return request({
            url: '/manage/user/add',
            method: 'post',
            data: user
        })
    },

    getById(_id) {
        return request({
            url: `/manage/user/find?_id=${_id}`,
            method: 'get',

        })
    },

    update(user) {
        return request({
            url: '/manage/user/update',
            method: 'post',
            data: user
        })
    },
    deleteById(userId) {
        return request({
            url: '/manage/user/delete',
            method: 'post',
            data: { userId }
        })
    },
    //密码校验
    checkPwd(_id, password) {
        return request({
            url: '/manage/user/pwd',
            method: 'post',
            data: {
                _id,
                password
            }
        })
    },

    //修改密码
    updatePwd(userId, password) {
        return request({
            url: '/manage/user/pwd',
            method: 'put',
            data: {
                userId,
                password
            }
        })
    }
}




