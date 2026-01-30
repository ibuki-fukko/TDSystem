<template>
  <div class="sso-callback-container">
    <div class="loading-wrapper">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>正在处理登录，请稍候...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

const router = useRouter()

const handleSSOCallback = () => {
  try {
    // 从URL中获取回调参数
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    
    if (!token && !code) {
      throw new Error('缺少认证参数')
    }
    
    // 模拟token解析和验证
    setTimeout(() => {
      // 模拟获取用户信息（实际项目中应从token中解析或调用API获取）
      const mockUserInfo = {
        id: 4,
        username: 'student1',
        realname: '王同学',
        role: 1, // 学生
        roleName: '学生',
        student_major_type: 1,
        advisor_id: 2
      }
      
      // 保存登录状态
      localStorage.setItem('token', token || 'mock-sso-token')
      localStorage.setItem('userInfo', JSON.stringify(mockUserInfo))
      localStorage.setItem('loginType', 'sso')
      
      ElMessage.success('SSO登录成功')
      
      // 根据用户角色跳转到对应页面
      redirectByRole(mockUserInfo.role)
    }, 1000)
  } catch (error) {
    console.error('SSO登录失败:', error)
    ElMessage.error('SSO登录失败，请重试')
    // 跳转到登录页
    router.push('/login')
  }
}

// 根据角色跳转页面
const redirectByRole = (role) => {
  switch (role) {
    case 1: // 学生
      router.push('/student/batch')
      break
    case 2: // 教师
      router.push('/') // 暂时跳转到首页
      break
    case 3: // 教秘
      router.push('/') // 暂时跳转到首页
      break
    case 9: // 管理员
      router.push('/admin/batch')
      break
    default:
      router.push('/')
  }
}

onMounted(() => {
  handleSSOCallback()
})
</script>

<style scoped>
.sso-callback-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
}

.is-loading {
  font-size: 48px;
  animation: rotate 1s linear infinite;
}

p {
  font-size: 18px;
  margin: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>