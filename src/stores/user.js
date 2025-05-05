import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, register } from '@/utils/api'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const username = ref(localStorage.getItem('username') || '')
  const uid = ref(localStorage.getItem('uid') || '')
  const role = ref(localStorage.getItem('role') || '')
  const loading = ref(false)
  const error = ref(null)
  
  // 登录
  const userLogin = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      const res = await login(userData)
      token.value = res.data.data.token
      username.value = userData.username
      uid.value = res.data.data.uid
      role.value = res.data.data.role !== undefined ? res.data.data.role : 4
      
      // 保存登录凭据到localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('username', username.value)
      localStorage.setItem('uid', uid.value)
      localStorage.setItem('role', role.value)
      
      // 如果记住密码，保存用户名和密码到localStorage
      if (userData.rememberMe) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('savedUsername', userData.username)
        localStorage.setItem('savedPassword', btoa(userData.password)) // 简单编码
        console.log('密码已保存到本地存储', { username: userData.username })
      } else {
        // 如果不记住密码，清除之前存储的密码
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('savedUsername')
        localStorage.removeItem('savedPassword')
        console.log('已清除本地存储的密码')
      }
      
      ElMessage.success('登录成功！')
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || '登录失败，请检查用户名和密码'
      error.value = message // 仍然设置错误状态，但不在界面显示
      ElMessage.error(message) // 使用ElMessage直接显示错误
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  // 注册
  const userRegister = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      const res = await register(userData)
      ElMessage.success('注册成功！正在跳转到登录页面...')
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || '注册失败，请稍后再试'
      error.value = message // 仍然设置错误状态，但不在界面显示
      ElMessage.error(message) // 使用ElMessage直接显示错误
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  // 登出
  const logout = () => {
    token.value = ''
    username.value = ''
    uid.value = ''
    role.value = ''
    
    // 清除所有登录信息，但保留记住的用户名和密码
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('uid')
    localStorage.removeItem('role')
    
    ElMessage.success('已退出登录')
  }
  
  // 检查是否已登录
  const isLoggedIn = () => !!token.value
  
  // 获取记住的用户名
  const getRememberedUsername = () => {
    const isRemembered = localStorage.getItem('rememberMe') === 'true'
    if (!isRemembered) {
      return ''
    }
    
    return localStorage.getItem('savedUsername') || ''
  }
  
  // 获取记住的用户密码
  const getRememberedPassword = () => {
    const isRemembered = localStorage.getItem('rememberMe') === 'true'
    if (!isRemembered) {
      return ''
    }
    
    const savedPassword = localStorage.getItem('savedPassword')
    try {
      return savedPassword ? atob(savedPassword) : ''
    } catch (e) {
      console.error('密码解码失败:', e)
      return ''
    }
  }

  return {
    token,
    username,
    uid,
    role,
    loading,
    error,
    userLogin,
    userRegister,
    logout,
    isLoggedIn,
    getRememberedUsername,
    getRememberedPassword
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token', 'username', 'uid', 'role'], // 只持久化这些字段
  }
}) 