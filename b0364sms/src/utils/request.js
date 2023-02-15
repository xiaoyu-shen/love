import axios from "axios";
import memoryUtils from "./memoryUtils";
import storageUtils from "@/utils/storageUtils.js";
import { Message, Loading } from 'element-ui'

const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
})

const loading = {
    loadingInstance: null,
    open() {
        if (this.loadingInstance == null) {
            this.loadingInstance = Loading.service({
                text: '拼命加载中',
                target: '.main',
                background: 'rgba(0,0,0,0.5)'
            })
        }
    },
    close() {
        if (this.loadingInstance !== null) {
            this.loadingInstance.close()
        }
        this.loadingInstance = null
    }
}

const getMenus = () => {
    if (memoryUtils.user.role_id) {
        const roleId = memoryUtils.user.role_id;
        const userMenus = memoryUtils.user.role.menus;
        request({
            url: `/menus`,
            method: 'post',
            data: { roleId }
        }).then(response => {
            const resp = response.data;
            if (resp.status === 0) {
                const menus = resp.data.menus;
                if (userMenus.length === menus.length) {
                    userMenus.forEach(item => {
                        if (menus.indexOf(item) === -1) {
                            memoryUtils.user = {};
                            storageUtils.removeUser();
                            Message({
                                message: '当前用户权限被修改，请重新登录',
                                type: 'warning'
                            });
                            window.location.replace('/login')
                        }
                    });
                } else {
                    memoryUtils.user = {};
                    storageUtils.removeUser();
                    Message({
                        message: '当前用户权限被修改，请重新登录',
                        type: 'warning'
                    });
                    window.location.replace('/login')

                }
            }
            return
        }).catch(err => {
            return
        })
    }
}

//请求拦截器
request.interceptors.request.use(config => {
    if (config.url !== '/menus') {
        loading.open()
        getMenus();
    }
    return config
}, error => {
    loading.close()
    return Promise.reject(error)
})

//响应拦截器
request.interceptors.response.use(response => {
    const resp = response.data
    if (resp.status != 0) {
        Message({
            message: resp.msg || '系统异常',
            type: 'warning',
            duration: 5000
        })
    }
    loading.close()
    return response
}), error => {
    loading.close()
    Message({
        message: error.message,
        type: 'error',
        duration: 5000
    })
    return Promise.reject(error)
}

export default request