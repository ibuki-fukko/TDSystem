import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'

// 路由配置
const routes = [
  // 通用基础页面
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/common/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/sso-callback',
    name: 'SSOCallback',
    component: () => import('../views/common/SSOCallback.vue'),
    meta: { title: 'SSO回调', requiresAuth: false }
  },
  {
    path: '/error/:code',
    name: 'ErrorPage',
    component: () => import('../views/common/ErrorPage.vue'),
    meta: { title: '错误页面', requiresAuth: false }
  },
  {
    path: '/404',
    redirect: '/error/404',
    meta: { requiresAuth: false }
  },
  {
    path: '/401',
    redirect: '/error/401',
    meta: { requiresAuth: false }
  },
  {
    path: '/403',
    redirect: '/error/403',
    meta: { requiresAuth: false }
  },
  
  // 主布局路由
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      // 首页
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页' }
      },
      
      // 管理员端页面
      {
        path: '/admin/batch',
        name: 'AdminBatch',
        component: () => import('../views/admin/BatchManagement.vue'),
        meta: { title: '答辩批次管理' }
      },
      
      // 学生端页面
      {
        path: '/student/batch',
        name: 'StudentBatch',
        component: () => import('../views/student/BatchList.vue'),
        meta: { title: '可报名批次列表' }
      },
      {
        path: '/student/application',
        name: 'StudentApplication',
        component: () => import('../views/student/ApplicationForm.vue'),
        meta: { title: '答辩申请' }
      },
      {
        path: '/student/my-applications',
        name: 'StudentMyApplications',
        component: () => import('../views/student/MyApplications.vue'),
        meta: { title: '我的申请' }
      }
    ]
  },
  
  // 404重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 本研教育管理系统` : '本研教育管理系统'
  
  // 检查是否需要认证
  if (to.meta.requiresAuth !== false) {
    // 检查是否已登录
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登录，跳转到登录页
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  next()
})

export default router