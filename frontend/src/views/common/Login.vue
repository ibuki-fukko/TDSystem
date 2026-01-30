<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <img src="/logo.png" alt="校徽" class="logo">
        <h1>北京航空航天大学</h1>
        <h2>研究生论文答辩系统</h2>
      </div>
      
      <div class="login-form-card">
        <h3 class="form-title">系统登录</h3>
        
        <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" />
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
          </el-form-item>
          
          <el-form-item label="验证码" prop="captcha">
            <div class="captcha-container">
              <el-input v-model="loginForm.captcha" placeholder="请输入验证码" prefix-icon="View" style="width: 60%" />
              <div class="captcha-image" @click="refreshCaptcha">
                {{ captchaText }}
              </div>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading">登录</el-button>
          </el-form-item>
        </el-form>
        
        <div class="sso-login">
          <el-divider content-position="center">其他登录方式</el-divider>
          <el-button type="info" class="sso-btn" @click="handleSSOLogin">
            <el-icon><Avatar /></el-icon>
            统一身份认证登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, View, Avatar } from '@element-plus/icons-vue'
import { mockLogin } from '../../api/auth'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const captchaText = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  captcha: '',
  rememberMe: false
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

// 生成验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 刷新验证码
const refreshCaptcha = () => {
  captchaText.value = generateCaptcha()
}

// 处理本地登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 使用模拟登录验证
    const result = mockLogin(loginForm.username, loginForm.password)
    
    if (result.success) {
      loading.value = false
      ElMessage.success('登录成功')
      
      // 保存登录状态
      const { token, user } = result.data
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify(user))
      if (loginForm.rememberMe) {
        localStorage.setItem('username', loginForm.username)
      }
      
      // 根据用户角色跳转到对应页面
      redirectByRole(user.role)
    } else {
      loading.value = false
      ElMessage.error(result.message || '登录失败')
    }
  } catch (error) {
    loading.value = false
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请重试')
  }
}

// 处理SSO登录
const handleSSOLogin = () => {
  // 模拟SSO登录跳转
  const ssoLoginUrl = 'https://sso.example.com/login?redirect_uri=' + encodeURIComponent(window.location.origin + '/sso-callback')
  window.location.href = ssoLoginUrl
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

// 初始化
onMounted(() => {
  // 生成初始验证码
  refreshCaptcha()
  // 从本地存储读取记住的用户名
  const savedUsername = localStorage.getItem('username')
  if (savedUsername) {
    loginForm.username = savedUsername
    loginForm.rememberMe = true
  }
})
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.login-header {
  text-align: center;
  color: white;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}

.login-header h1 {
  font-size: 24px;
  margin: 0 0 5px 0;
}

.login-header h2 {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.login-form-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 30px;
  width: 400px;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  color: #1e3c72;
}

.captcha-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-image {
  width: 35%;
  height: 40px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #1e3c72;
  cursor: pointer;
  user-select: none;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.sso-btn {
  width: 100%;
  height: 40px;
}

@media (max-width: 480px) {
  .login-form-card {
    width: 100%;
    padding: 20px;
  }
}
</style>