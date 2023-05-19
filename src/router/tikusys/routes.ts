/* eslint-disable @typescript-eslint/promise-function-async */
import { RouteRecordRaw } from 'vue-router'

const mainRoutes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views-tikusys/home.vue'),
    meta: {
      title: 'Home',
      requiresAuth: true,
    },
  },
  {
    name: 'update',
    path: '/update',
    component: () => import('@/views-tikusys/update.vue'),
    meta: {
      title: '题库 - 创建',
      requiresAuth: true,
    },
  },
  {
    name: 'tiku-create',
    path: '/tiku/create',
    component: () => import('@/views-tikusys/tiku/create/Create'),
    meta: {
      title: '题库 - 添加',
      requiresAuth: true,
    },
  },
  {
    name: 'exampaper-create',
    path: '/exampaper/create',
    component: () => import('@/views-tikusys/exampaper/create/Create'),
    meta: {
      title: '试卷 - 生成',
      requiresAuth: true,
    },
  },
  {
    name: 'examination-correcting',
    path: '/examination/correcting',
    component: () => import('@/views-tikusys/examination/correcting/Correcting'),
    meta: {
      title: '老师 - 阅卷',
      requiresAuth: true,
    },
  },
  {
    name: 'tiku-list',
    path: '/tiku/list',
    component: () => import('@/views-tikusys/tiku/list/List'),
    meta: {
      title: '题库 - 列表',
      requiresAuth: true,
    },
  },
  {
    name: 'examination-schedule',
    path: 'examination/schedule',
    component: () => import('@/views-tikusys/examination/schedule/Schedule'),
    meta: {
      title: '考试 - 规划',
      requiresAuth: true,
    },
  },
  /**
   * 班级管理
   */
  {
    name: 'class-overview',
    path: '/class/overflow',
    component: () => import('@/views-tikusys/class/Overview/Overview'),
    meta: {
      title: '班级 - 总览',
      requiresAuth: true,
    },
  },
  /**
   * 学生管理
   */
  {
    name: 'personnel-student',
    path: '/personnel/student',
    component: () => import('@/views-tikusys/personnel/student/Student'),
    meta: {
      title: '学生 - 面板',
      requiresAuth: true,
    },
  },
  /**
   * 教师管理
   */
  {
    name: 'personnel-teacher',
    path: '/personnel/teacher',
    component: () => import('@/views-tikusys/personnel/teacher/Teacher'),
    meta: {
      title: '教师 - 面板',
      requiresAuth: true,
    },
  },
  {
    name: 'about',
    path: '/about',
    component: () => import('@/views-tikusys/about.vue'),
    meta: {
      title: 'About',
      requiresAuth: true
    }
  },
];

const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views-tikusys/login.vue'),
    meta: {
      title: 'Sign In'
    },
  },
  {
    name: 'layout',
    path: '/',
    component: () => import('@/views-tikusys/layouts/index.vue'),
    children: [...mainRoutes,],
  },
  // ## not found page
  {
    name: 'not-found',
    path: '/:path*',
    component: () => import('@/views-tikusys/error.vue'),
    meta: {
      title: 'Oh no!',
    },
  },
];

export default routes;
