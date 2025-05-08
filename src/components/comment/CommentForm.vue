<template>
  <div class="mb-6 relative">
    <!-- 评论触发按钮 -->
    <button 
      v-if="!isExpanded" 
      @click="expandForm"
      class="w-full bg-gray-800 shadow-gray-900/30 rounded-xl p-3 border border-blue-900/30 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-blue-800/40 group"
    >
      <div class="flex items-center">
        <!-- 用户头像 - 使用首字母 -->
        <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold mr-3 ring-2 ring-white dark:ring-gray-800 shadow-sm transition-transform duration-300 hover:scale-110" :style="{ background: getUserColor(userStore.username) }">
          {{ getUserInitial(userStore.username) }}
        </div>
        
        <span class="text-gray-400 dark:text-gray-500 text-sm">{{ isLoggedIn ? '点击这里发表评论...' : '登录后才能发表评论' }}</span>
      </div>
      
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    </button>
    
    <!-- 展开的评论表单 -->
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div 
        v-show="isExpanded"
        class="transform transition-all duration-500 hover:scale-[1.01]"
      >
        <div class="bg-gray-800 shadow-gray-900/30 rounded-xl p-4 border border-blue-900/30 overflow-hidden relative">
          <!-- 装饰波浪背景 -->
          <div class="absolute -top-24 -right-24 w-44 h-44 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-xl"></div>
          <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full blur-xl"></div>
          
          <!-- 标题和关闭按钮 -->
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-lg font-medium text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              发表评论
            </h4>
            
            <button 
              @click="collapseForm" 
              class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- 未登录状态提示和登录链接 -->
          <div v-if="!isLoggedIn" class="mb-4 p-5 rounded-xl bg-blue-900/20 border border-blue-800/30">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-blue-800 dark:text-blue-300 font-bold text-lg">请先登录</p>
                <p class="text-blue-600 dark:text-blue-400 mt-1">您需要登录后才能发表评论、参与讨论</p>
              </div>
            </div>
            <div class="mt-5 flex justify-center">
              <router-link to="/login" class="btn-login">
                <span class="flex items-center text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  立即登录
                </span>
              </router-link>
            </div>
          </div>
          
          <!-- 输入区域 (仅登录用户可见) -->
          <template v-if="isLoggedIn">
            <div class="relative">
              <textarea
                v-model="content"
                class="w-full p-3 bg-slate-800/80 text-gray-200 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none shadow-inner transition-all duration-300 min-h-[100px] placeholder-gray-500"
                placeholder="说点什么吧..."
                @focus="isInputFocused = true"
                @blur="isInputFocused = false"
                ref="commentTextarea"
              ></textarea>
              
              <!-- 聚焦时显示的装饰元素 -->
              <div 
                v-show="isInputFocused" 
                class="absolute top-0 left-0 w-full h-full pointer-events-none"
              >
                <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                <div class="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full animate-ping" style="animation-delay: 0.5s"></div>
              </div>
            </div>
            
            <!-- 提交按钮 -->
            <div class="flex justify-between items-center mt-3">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                <span v-if="content.length > 0">{{ content.length }}/200</span>
              </div>
              
              <div class="flex space-x-2">
                <button
                  @click="collapseForm"
                  class="px-4 py-2 rounded-lg text-gray-500 bg-transparent hover:bg-gray-700 hover:text-gray-300 transition-all duration-300"
                >
                  取消
                </button>
                
                <button
                  @click="submitComment"
                  :disabled="!canSubmit || submitting"
                  class="inline-flex items-center text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                >
                  <!-- 按钮内闪光效果 -->
                  <span 
                    v-if="canSubmit" 
                    class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  ></span>
                  
                  <span class="relative z-10 flex items-center">
                    <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ submitting ? '提交中...' : '发表评论' }}
                    <svg 
                      v-if="!submitting" 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import { addComment } from '@/utils/api'
import { ElMessage } from 'element-plus'

const props = defineProps({
  targetType: {
    type: String,
    required: true,
    validator: (value) => ['news', 'product'].includes(value)
  },
  targetId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['comment-added'])
const userStore = useUserStore()
const content = ref('')
const submitting = ref(false)
const isInputFocused = ref(false)
const isExpanded = ref(false)
const commentTextarea = ref(null)

// 用户是否登录
const isLoggedIn = computed(() => {
  return userStore.isLoggedIn()
})

// 能否提交评论
const canSubmit = computed(() => {
  // 必须登录，并且评论内容符合要求
  return isLoggedIn.value && content.value.trim().length > 0 && content.value.length <= 200
})

// 展开评论表单
const expandForm = async () => {
  isExpanded.value = true
  // 等待DOM更新后聚焦文本框
  await nextTick(() => {
    if (commentTextarea.value && isLoggedIn.value) {
      commentTextarea.value.focus()
    }
  })
}

// 折叠评论表单
const collapseForm = () => {
  isExpanded.value = false
  content.value = '' // 清空内容
}

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

// 提交评论
const submitComment = async () => {
  // 检查是否登录
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录后再发表评论')
    return
  }
  
  if (!canSubmit.value) return
  
  submitting.value = true
  try {
    await addComment({
      targetType: props.targetType,
      targetId: props.targetId,
      content: content.value
    })
    
    // 成功提交
    content.value = ''
    ElMessage({
      message: '评论发表成功',
      type: 'success',
      customClass: 'comment-success-message'
    })
    emit('comment-added')
    
    // 添加成功动画
    const confetti = document.createElement('div')
    confetti.className = 'comment-confetti'
    document.body.appendChild(confetti)
    
    setTimeout(() => {
      document.body.removeChild(confetti)
    }, 2000)
    
    // 成功后折叠表单
    collapseForm()
    
  } catch (error) {
    console.error('提交评论失败:', error)
    ElMessage.error('评论发表失败，请稍后再试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  0% { transform: scale(1); opacity: 1; }
  75%, 100% { transform: scale(2); opacity: 0; }
}

/* 评论成功提示 */
:deep(.comment-success-message) {
  background: linear-gradient(to right, #4ade80, #3b82f6);
  color: white;
  border: none;
  font-weight: 500;
}

/* 提交成功动画 */
.comment-confetti {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  background-image: 
    radial-gradient(circle at 25% 25%, #ff6b6b 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, #4dabf7 2px, transparent 2px),
    radial-gradient(circle at 50% 50%, #63e6be 4px, transparent 4px),
    radial-gradient(circle at 80% 20%, #ffd43b 3px, transparent 3px),
    radial-gradient(circle at 20% 80%, #ae3ec9 3px, transparent 3px);
  background-size: 60px 60px;
  animation: confetti-fall 2s linear forwards;
}

@keyframes confetti-fall {
  0% { 
    opacity: 0;
    background-position: 0 -60px, 0 -60px, 0 -60px, 0 -60px, 0 -60px; 
  }
  10% { opacity: 1; }
  100% { 
    opacity: 0;
    background-position: 0 calc(100% + 60px), 0 calc(100% + 60px), 0 calc(100% + 60px), 0 calc(100% + 60px), 0 calc(100% + 60px);
  }
}

/* 登录按钮 */
.btn-login {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  border-radius: 9999px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to right, #2563eb, #7c3aed);
}

.btn-login:active {
  transform: translateY(0);
}
</style> 