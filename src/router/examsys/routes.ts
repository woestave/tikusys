/* eslint-disable @typescript-eslint/promise-function-async */
import { RouteRecordRaw } from 'vue-router'

const mainRoutes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views-examsys/home.vue'),
    meta: {
      title: 'Home',
      requiresAuth: true,
    },
  },
  {
    name: 'exam',
    path: '/exam',
    component: () => import('@/views-examsys/exam/Exam'),
    meta: {
      title: '考试列表 - 考试系统',
      requiresAuth: true,
    },
  },
  {
    name: 'examing',
    path: '/examing/:examinationId',
    component: () => import('@/views-examsys/examing/Examing'),
    meta: {
      title: '开始考试 - 考试系统',
      requiresAuth: true,
    },
  },
  {
    name: 'query-results',
    path: '/query-results',
    component: () => import('@/views-examsys/query-results/QueryResults'),
    meta: {
      title: '成绩查询 - 考试系统',
      requiresAuth: true,
    },
  },
  {
    name: 'update-password',
    path: '/update-password',
    component: () => import('@/views-examsys/update-password/UpdatePassword'),
    meta: {
      title: '修改密码 - 考试系统',
      requiresAuth: true,
    },
  },
];

const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views-examsys/login/login.vue'),
    meta: {
      title: 'Sign In'
    },
  },
  {
    name: 'layout',
    path: '/',
    component: () => import('@/views-examsys/layouts/index.vue'),
    children: [...mainRoutes,],
  },
  // ## not found page
  {
    name: 'not-found',
    path: '/:path*',
    component: () => import('@/views-examsys/error.vue'),
    meta: {
      title: 'Oh no!',
    },
  },
];

export default routes;
