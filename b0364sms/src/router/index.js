import Vue from "vue";
import VueRouter from "vue-router";
import Login from '@/views/login'
import Layout from '@/components/Layout.vue'
import Home from '@/views/home'
import User from '@/views/user'
import Role from '@/views/role'
import Class from '@/views/students/Class.vue'
import Majors from '@/views/students/Majors.vue'
import School from '@/views/students/School.vue'
import Student from '@/views/students/Student.vue'
import StudentUpdate from '@/views/students/StudentUpdate.vue'
Vue.use(VueRouter);

const routes = [
  {
    // login
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',    //重定向
    children: [
      {
        path: '/home',
        component: Home,
        meta: { title: '首页' }
      },
      {
        path: '/role',
        component: Role,
        meta: { title: '角色管理' }
      },
      {
        path: '/user',
        component: User,
        meta: { title: '用户管理' }
      },
      {
        path: '/school',
        component: School,
        meta: { title: '活动管理' }
      },
      {
        path: '/student',
        component: Student,
        meta: { title: '会员管理' }
      },
      {
        path: '/student/update/:_id',
        component: StudentUpdate,
        meta: { title: '会员编辑' }
      },

      {
        path: '/majors',
        component: Majors,
        meta: { title: '地区管理' }
      },
      {
        path: '/class',
        component: Class,
        meta: { title: '交友圈管理' }
      },
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
