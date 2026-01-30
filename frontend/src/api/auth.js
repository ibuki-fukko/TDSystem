import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 基础URL
  timeout: 10000, // 超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 登录验证
export const login = async (username, password, captcha) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
      captcha
    })
    return response.data
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

// SSO登录验证
export const ssoLogin = async (code) => {
  try {
    const response = await api.post('/auth/sso-login', {
      code
    })
    return response.data
  } catch (error) {
    console.error('SSO登录失败:', error)
    throw error
  }
}

// 获取用户信息
export const getUserInfo = async () => {
  try {
    const response = await api.get('/auth/user-info')
    return response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

// 退出登录
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout')
    return response.data
  } catch (error) {
    console.error('退出登录失败:', error)
    throw error
  }
}

// 模拟登录验证（用于开发测试）
export const mockLogin = (username, password) => {
  // 模拟用户数据，对应数据库中的用户表
  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      password_hash: 'admin123', // 实际项目中应使用加密密码
      realname: '管理员',
      role: 9, // 管理员
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      username: 'teacher1',
      password_hash: 'teacher123',
      realname: '张老师',
      role: 2, // 教师
      teacher_type: 0,
      can_be_judge: true,
      can_be_chairman: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      username: 'secretary1',
      password_hash: 'secretary123',
      realname: '李秘书',
      role: 3, // 教秘
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      username: 'student1',
      password_hash: 'student123',
      realname: '王同学',
      role: 1, // 学生
      student_major_type: 1,
      advisor_id: 2,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]

  // 模拟登录验证
  const user = mockUsers.find(u => u.username === username && u.password_hash === password)
  
  if (user) {
    return {
      success: true,
      data: {
        token: `mock-token-${user.id}`,
        user: {
          id: user.id,
          username: user.username,
          realname: user.realname,
          role: user.role,
          roleName: getRoleName(user.role),
          ...(user.role === 1 && {
            student_major_type: user.student_major_type,
            advisor_id: user.advisor_id
          }),
          ...(user.role === 2 && {
            teacher_type: user.teacher_type,
            can_be_judge: user.can_be_judge,
            can_be_chairman: user.can_be_chairman
          })
        }
      }
    }
  } else {
    return {
      success: false,
      message: '用户名或密码错误'
    }
  }
}

// 获取角色名称
const getRoleName = (role) => {
  const roleMap = {
    1: '学生',
    2: '教师',
    3: '教秘',
    9: '管理员'
  }
  return roleMap[role] || '未知'
}

export default api