<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-code">{{ errorCode }}</div>
      <h2 class="error-title">{{ errorTitle }}</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button v-if="showLogin" @click="goLogin">去登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const errorCode = ref('404')
const errorTitle = ref('页面不存在')
const errorMessage = ref('抱歉，您访问的页面不存在或已被删除')
const showLogin = ref(false)

const initErrorPage = () => {
  const code = route.params.code || '404'
  errorCode.value = code
  
  switch (code) {
    case '401':
      errorTitle.value = '未登录'
      errorMessage.value = '抱歉，您尚未登录，请先登录后再访问'
      showLogin.value = true
      break
    case '403':
      errorTitle.value = '权限不足'
      errorMessage.value = '抱歉，您没有权限访问该页面'
      break
    case '404':
    default:
      errorTitle.value = '页面不存在'
      errorMessage.value = '抱歉，您访问的页面不存在或已被删除'
      break
  }
}

const goHome = () => {
  router.push('/')
}

const goLogin = () => {
  router.push('/login')
}

onMounted(() => {
  initErrorPage()
})
</script>

<style scoped>
.error-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.error-content {
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 32px;
  margin-bottom: 16px;
}

.error-message {
  font-size: 16px;
  margin-bottom: 32px;
  opacity: 0.9;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-content {
    padding: 30px;
    margin: 0 20px;
  }
}
</style>