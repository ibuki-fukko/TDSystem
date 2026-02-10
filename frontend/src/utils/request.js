import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  // 注意：根据您的实际后端地址修改，如果配置了代理则保持 /api
  baseURL: '/api', 
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      // 按照文档要求：Token格式为：Bearer eyJ...
      // 如果后端返回的 token 已经包含 'Bearer ' 前缀，则直接使用
      // 如果没有，则手动拼接。通常建议后端返回纯 token，前端拼接。
      // 这里假设 localStorage 存的是完整的 (含 Bearer) 或不含 Bearer 的纯 token
      // 为了保险，我们判断一下
      config.headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 文档规定：code: 200 为成功
    if (res.code !== 200) {
      ElMessage.error(res.message || 'Error')
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // 返回 data 部分
      return res.data
    }
  },
  error => {
    // 处理 HTTP 错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          // 这里可以添加跳转到登录页的逻辑
          break
        case 403:
          ElMessage.error('没有权限执行此操作')
          break
        default:
          ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else {
      ElMessage.error('网络连接失败')
    }
    return Promise.reject(error)
  }
)

export default service