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
      
      // 如果记住密码，保存用户名和密码
      if (userData.rememberMe) {
        localStorage.setItem('password', btoa(userData.password)) // 简单编码
      } else {
        localStorage.removeItem('password')
      }
      
      ElMessage.success('登录成功！')
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || '登录失败，请检查用户名和密码'
      error.value = message
      ElMessage.error(message)
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
      error.value = message
      ElMessage.error(message)
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
    localStorage.removeItem('password')
    ElMessage.success('已退出登录')
  }
  
  // 检查是否已登录
  const isLoggedIn = () => !!token.value
  
  // 获取记住的用户密码
  const getRememberedPassword = () => {
    const savedPassword = localStorage.getItem('password')
    return savedPassword ? atob(savedPassword) : ''
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
    getRememberedPassword
  }
}, {
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token', 'username', 'uid', 'role'], // 只持久化这些字段
  }
}) 