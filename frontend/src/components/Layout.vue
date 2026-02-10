<template>
  <div class="layout-container">
    <!-- 头部导航栏 -->
    <el-header class="layout-header">
      <div class="header-left">
        <el-button type="text" class="menu-toggle" @click="toggleMenu" :icon="menuCollapse ? 'Menu' : 'Close'" />
        <div class="logo">
          <img src="/logo.png" alt="校徽" class="logo-img">
          <span class="logo-text">研究生论文答辩系统</span>
        </div>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click" @command="handleDropdownCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="userAvatar"></el-avatar>
            <span class="user-name">{{ userName }}</span>
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <div class="layout-body">
      <!-- 侧边菜单 -->
      <el-aside class="layout-sidebar" :width="menuCollapse ? '64px' : '240px'" :collapsed-width="'64px'" v-model:collapsed="menuCollapse">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="menuCollapse"
          :collapse-transition="false"
          router
          :unique-opened="true"
        >
          <template v-for="item in menuList" :key="item.path">
            <el-menu-item v-if="!item.children" :index="item.path">
              <el-icon><component :is="item.icon" /></el-icon>
              <template #title>{{ item.label }}</template>
            </el-menu-item>
            <el-sub-menu v-else :index="item.path">
              <template #title>
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
                <template #title>{{ child.label }}</template>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main class="layout-main">
        <!-- 面包屑 -->
        <el-breadcrumb class="breadcrumb" separator="/">
          <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
            <router-link v-if="item.path" :to="item.path">{{ item.label }}</router-link>
            <span v-else>{{ item.label }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        
        <!-- 内容区域 -->
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Menu, Close, ArrowDown, House, User, Lock, View, Avatar, Setting, Document, UserFilled, School, DataAnalysis, Message } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 菜单折叠状态
const menuCollapse = ref(false)

// 用户信息
const userName = ref('管理员')
const userAvatar = ref('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%2C%20professional%2C%20blue%20background&image_size=square')
const userRole = ref(9) // 默认管理员角色

// 动态菜单列表（根据角色生成）
const menuList = ref([])

// 加载用户信息和菜单
const loadUserInfo = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr)
      userName.value = userInfo.realname || userInfo.username
      userRole.value = userInfo.role
      generateMenuByRole(userInfo.role)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      generateMenuByRole(9) // 默认管理员角色
    }
  } else {
    generateMenuByRole(9) // 默认管理员角色
  }
}

// 根据角色生成菜单
const generateMenuByRole = (role) => {
  const baseMenu = [
    {
      path: '/',
      label: '首页',
      icon: House
    }
  ]
  
  let roleMenu = []
  
  switch (role) {
    case 1: // 学生
      roleMenu = [
        {
          path: '/student',
          label: '学生管理',
          icon: School,
          children: [
            {
              path: '/student/batch',
              label: '可报名批次列表'
            },
            {
              path: '/student/my-applications',
              label: '我的申请'
            },
            {
              path: '/student/upload',
              label: '论文上传'
            },
            {
              path: '/student/list',
              label: '我的论文'
            }
            // 其他学生页面将在后续开发中添加
          ]
        }
      ]
      break
    case 2: // 教师
      roleMenu = [
        {
          path: '/teacher',
          label: '教师管理',
          icon: UserFilled,
          children: [
            {
              path: '/',
              label: '教师首页'
            }
            // 其他教师页面将在后续开发中添加
          ]
        }
      ]
      break
    case 3: // 教秘
      roleMenu = [
        {
          path: '/secretary',
          label: '教秘管理',
          icon: Document,
          children: [
            {
              path: '/',
              label: '教秘首页'
            }
            // 其他教秘页面将在后续开发中添加
          ]
        }
      ]
      break
    case 9: // 管理员
      roleMenu = [
        {
          path: '/admin',
          label: '管理员管理',
          icon: Setting,
          children: [
            {
              path: '/admin/batch',
              label: '答辩批次管理'
            }
            // 其他管理员页面将在后续开发中添加
          ]
        }
      ]
      break
  }
  
  menuList.value = [...baseMenu, ...roleMenu]
}

// 初始化用户信息和菜单
loadUserInfo()

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 面包屑列表
const breadcrumbList = ref([])

const generateBreadcrumb = () => {
  const path = route.path
  const breadcrumbs = [{ label: '首页', path: '/' }]
  
  // 简单的面包屑生成逻辑，实际项目中可能需要更复杂的处理
  if (path !== '/') {
    const pathSegments = path.split('/').filter(Boolean)
    let currentPath = ''
    
    pathSegments.forEach(segment => {
      currentPath += '/' + segment
      // 查找对应的菜单标签
      let label = segment
      menuList.value.forEach(item => {
        if (item.path === currentPath) {
          label = item.label
        } else if (item.children) {
          item.children.forEach(child => {
            if (child.path === currentPath) {
              label = child.label
            }
          })
        }
      })
      breadcrumbs.push({ label, path: currentPath })
    })
  }
  
  breadcrumbList.value = breadcrumbs
}

// 切换菜单折叠状态
const toggleMenu = () => {
  menuCollapse.value = !menuCollapse.value
}

// 处理下拉菜单命令
const handleDropdownCommand = (command) => {
  switch (command) {
    case 'profile':
      console.log('个人中心')
      break
    case 'settings':
      console.log('设置')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  // 清除登录状态
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('loginType')
  
  ElMessage.success('退出登录成功')
  // 跳转到登录页
  router.push('/login')
}

// 监听路由变化，更新面包屑
watch(() => route.path, () => {
  generateBreadcrumb()
}, { immediate: true })

onMounted(() => {
  generateBreadcrumb()
})
</script>

<style scoped>
.layout-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-header {
  height: 64px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  font-size: 20px;
  color: #1e3c72;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #1e3c72;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.user-name {
  font-size: 14px;
  color: #303133;
}

.layout-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.layout-sidebar {
  background: white;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.layout-main {
  flex: 1;
  background: #f5f7fa;
  overflow-y: auto;
  padding: 24px;
}

.breadcrumb {
  margin-bottom: 24px;
}

.content-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 24px;
  min-height: calc(100vh - 180px);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-sidebar {
    position: fixed;
    left: 0;
    top: 64px;
    height: calc(100vh - 64px);
    z-index: 99;
  }
  
  .layout-main {
    padding: 16px;
  }
  
  .content-wrapper {
    padding: 16px;
  }
}
</style>