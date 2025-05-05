<template>
  <div 
    class="border-b border-gray-100 dark:border-gray-700 py-3 px-2 rounded-xl transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 relative overflow-hidden group"
  >
    <!-- 波浪效果背景 -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/0 to-blue-100/0 dark:from-blue-900/0 dark:via-blue-900/0 dark:to-blue-900/0 group-hover:from-blue-100/30 group-hover:via-blue-100/10 group-hover:to-blue-100/0 dark:group-hover:from-blue-900/20 dark:group-hover:via-blue-900/10 dark:group-hover:to-blue-900/0 transition-all duration-700"></div>
    
    <div class="flex space-x-3 relative">
      <!-- 用户头像 - 使用首字母 -->
      <div class="avatar-wrapper">
        <div 
          class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 ring-2 ring-white dark:ring-gray-800"
          :style="{ background: getUserColor(comment.user ? comment.user.username : '') }"
        >
          {{ getUserInitial(comment.user ? comment.user.username : '') }}
        </div>
      </div>
      
      <!-- 评论内容 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <p class="font-medium text-gray-900 dark:text-white flex items-center">
            {{ comment.user ? comment.user.username : '匿名用户' }}
            <span class="inline-block ml-2 text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">用户</span>
          </p>
          <div class="flex items-center space-x-1">
            <!-- 时间气泡 -->
            <div class="time-bubble text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <time>{{ formatTime(comment.createdAt) }}</time>
            </div>
            
            <!-- 删除按钮 (仅对自己的评论显示) -->
            <button 
              v-if="canDelete" 
              @click="handleDelete"
              class="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 text-sm p-1.5 rounded-full transform hover:rotate-12"
              :disabled="loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="comment-content mt-2 text-gray-800 dark:text-gray-200 break-words whitespace-pre-line bg-white dark:bg-gray-800/50 p-3 rounded-lg shadow-sm relative overflow-hidden">
          <!-- 装饰性的引号图标 -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-100 dark:text-gray-700 absolute -top-1 -left-1 transform -rotate-6 opacity-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <!-- 实际评论内容 -->
          <p class="relative z-10">{{ comment.content }}</p>
        </div>
        
        <!-- 交互区域 -->
        <div class="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button class="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 p-1 text-xs flex items-center space-x-1 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>赞</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { deleteComment } from '@/utils/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  comment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['comment-deleted'])
const userStore = useUserStore()
const loading = ref(false)

// 判断是否可以删除评论
const canDelete = computed(() => {
  if (!userStore.isLoggedIn()) return false
  
  // 用户是评论发布者
  const isAuthor = props.comment.user && userStore.uid === props.comment.user.uid
  
  // 或者是管理员
  const isAdmin = userStore.role === 1 || userStore.role === '1' || userStore.role === 'admin'
  
  return isAuthor || isAdmin
})

// 获取用户首字母
const getUserInitial = (username) => {
  if (!username) return '?'
  return username.charAt(0).toUpperCase()
}

// 根据用户名生成固定颜色
const getUserColor = (username) => {
  if (!username) return 'linear-gradient(to bottom right, #818cf8, #c084fc)'
  
  // 预定义一些渐变色组合
  const gradients = [
    'linear-gradient(to bottom right, #f87171, #fb7185)', // 红粉色
    'linear-gradient(to bottom right, #818cf8, #c084fc)', // 紫蓝色
    'linear-gradient(to bottom right, #60a5fa, #34d399)', // 蓝绿色
    'linear-gradient(to bottom right, #fbbf24, #f59e0b)', // 橙黄色
    'linear-gradient(to bottom right, #10b981, #059669)', // 绿色
    'linear-gradient(to bottom right, #6366f1, #4f46e5)', // 靛蓝色
    'linear-gradient(to bottom right, #ec4899, #db2777)', // 粉色
    'linear-gradient(to bottom right, #f43f5e, #e11d48)', // 玫红色
    'linear-gradient(to bottom right, #0ea5e9, #0284c7)', // 天蓝色
    'linear-gradient(to bottom right, #a855f7, #9333ea)'  // 紫色
  ]
  
  // 使用用户名的字符代码总和来选择一个渐变色
  const charCodeSum = username.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const gradientIndex = charCodeSum % gradients.length
  
  return gradients[gradientIndex]
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return '未知时间'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000) // 时间差(秒)
  
  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + '分钟前'
  } else if (diff < 86400) {
    return Math.floor(diff / 3600) + '小时前'
  } else if (diff < 2592000) {
    return Math.floor(diff / 86400) + '天前'
  } else {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
}

// 处理删除评论
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    loading.value = true
    await deleteComment(props.comment.id)
    ElMessage.success('评论已删除')
    emit('comment-deleted', props.comment.id)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
      ElMessage.error('删除评论失败，请稍后再试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.avatar-wrapper {
  position: relative;
}

.avatar-wrapper::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  bottom: 0;
  right: 0;
  border: 2px solid white;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
}

.comment-content {
  transition: all 0.3s ease;
}

.comment-content:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-1px);
}

.time-bubble {
  position: relative;
  overflow: hidden;
}

.time-bubble::before {
  content: '';
  position: absolute;
  left: -50%;
  top: 0;
  width: 30%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
  transform: skewX(-25deg);
  animation: timeBubbleShine 3s infinite;
  animation-delay: calc(var(--shine-delay, 0) * 1s);
}

@keyframes timeBubbleShine {
  0% { left: -50%; }
  100% { left: 150%; }
}
</style> 