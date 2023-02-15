const menuList = [
    {
        title: '首页',
        index: '/home',
        icon: 'el-icon-s-home',
        isPublic: true
    },
    {
        title: '用户管理',
        index: '/user',
        icon: 'el-icon-s-custom'
    },
    {
        title: '角色管理',
        index: '/role',
        icon: 'el-icon-user-solid'
    },
    {
        title: '会员',
        index: '/students',
        icon: 'el-icon-user',
        children: [
            {
                title: '活动管理',
                index: '/school',
                icon: 'el-icon-school'
            },
            {
                title: '地区管理',
                index: '/majors',
                icon: 'el-icon-collection'
            },
            {
                title: '交友圈管理',
                index: '/class',
                icon: 'el-icon-house'
            },
            {
                title: '会员管理',
                index: '/student',
                icon: 'el-icon-s-check'
            },
        ]
    },
]

export default menuList;