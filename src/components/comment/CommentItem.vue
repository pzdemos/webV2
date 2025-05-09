<template>
  <div 
    class="border-b border-gray-200 dark:border-gray-800/50 py-3 px-2 rounded-xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 relative overflow-hidden group"
  >
    <!-- 波浪效果背景 -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/0 to-blue-100/0 dark:from-blue-900/0 dark:via-blue-900/0 dark:to-blue-900/0 group-hover:from-blue-100/50 group-hover:via-blue-100/30 group-hover:to-blue-100/0 dark:group-hover:from-blue-900/20 dark:group-hover:via-blue-900/10 dark:group-hover:to-blue-900/0 transition-all duration-700"></div>
    
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
          <p class="font-medium text-gray-800 dark:text-white flex items-center">
            {{ comment.user ? comment.user.username : '匿名用户' }}
            <span class="inline-block ml-2 text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full">用户</span>
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
              class="text-red-500 hover:text-red-400 hover:bg-red-900/30 transition-all duration-200 text-sm p-1.5 rounded-full transform hover:rotate-12"
              :disabled="loading"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="comment-content mt-2 text-gray-700 dark:text-gray-200 break-words whitespace-pre-line bg-white dark:bg-gray-800/50 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden comment-with-watermark">
          <!-- 高级复杂水印背景 -->
          <div class="watermark-container">
            <!-- 装饰性框架 -->
            <div class="watermark-frame"></div>
            
            <!-- 几何装饰线条 -->
            <div class="watermark-geo watermark-geo-1"></div>
            <div class="watermark-geo watermark-geo-2"></div>
            <div class="watermark-geo watermark-geo-3"></div>
            
            <!-- 微妙参考线 -->
            <div class="watermark-grid watermark-grid-h"></div>
            <div class="watermark-grid watermark-grid-v"></div>
            
            <!-- 左侧装饰元素 -->
            <div class="watermark-side-decor left-decor">
              <div class="watermark-side-dot"></div>
              <div class="watermark-side-line"></div>
            </div>
            
            <!-- 右侧装饰元素 -->
            <div class="watermark-side-decor right-decor">
              <div class="watermark-side-dot"></div>
              <div class="watermark-side-line"></div>
            </div>
            
            <!-- 中心微妙标志 -->
            <div class="watermark-center-mark">
              <div class="center-circle"></div>
              <div class="center-plus-h"></div>
              <div class="center-plus-v"></div>
            </div>
          </div>
          <!-- 实际评论内容 -->
          <p class="relative z-10">{{ comment.content }}</p>
        </div>
        
        <!-- 交互区域 - 点赞功能 -->
        <div class="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            @click="toggleLike" 
            :class="[
              'like-button', 
              'flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-300',
              isLiked ? 'liked bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400'
            ]"
          >
            <!-- 点赞图标容器（用于动画效果） -->
            <div class="like-icon-wrapper relative">
              <!-- 主图标 -->
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="like-icon transition-all duration-300"
                :class="{'liked-icon': isLiked}"
                viewBox="0 0 24 24">
                <!-- 未点赞状态用描边 -->
                <path 
                  v-if="!isLiked" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                  stroke="currentColor"
                  fill="none"
                />
                <!-- 已点赞状态用填充 -->
                <path 
                  v-else
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  fill="currentColor"
                />
                
                <!-- 微粒动画元素 - 只在已点赞时显示 -->
                <g v-if="showParticles" class="like-particles">
                  <circle class="particle particle-1" cx="14" cy="8" r="0.5" fill="currentColor"/>
                  <circle class="particle particle-2" cx="18" cy="11" r="0.5" fill="currentColor"/>
                  <circle class="particle particle-3" cx="19" cy="14" r="0.5" fill="currentColor"/>
                  <circle class="particle particle-4" cx="16" cy="19" r="0.5" fill="currentColor"/>
                </g>
              </svg>
            </div>
            <!-- 文字 -->
            <span :class="{'text-blue-600 dark:text-blue-400 font-medium': isLiked}">{{ isLiked ? '已赞' : '赞' }}</span>
            <!-- 点赞数量 -->
            <span 
              v-if="likes > 0" 
              :class="['like-count transition-all duration-300', isLiked ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400']"
            >
              {{ likes }}
            </span>
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

const emit = defineEmits(['comment-deleted', 'like-toggled'])
const userStore = useUserStore()
const loading = ref(false)
const isLiked = ref(props.comment.isLiked || false)
const likes = ref(props.comment.likes || 0)
const showParticles = ref(false)

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

// 点赞功能
const toggleLike = () => {
  // 判断用户是否登录
  if (!userStore.isLoggedIn()) {
    ElMessage.warning('请先登录后再点赞')
    return
  }
  
  // 切换点赞状态
  isLiked.value = !isLiked.value
  
  // 更新点赞数
  if (isLiked.value) {
    likes.value++
    // 显示粒子动画
    showParticles.value = true
    setTimeout(() => {
      showParticles.value = false
    }, 1000)  // 动画持续1秒后隐藏
  } else {
    likes.value = Math.max(0, likes.value - 1)
  }
  
  // 发出点赞事件
  emit('like-toggled', {
    commentId: props.comment.id,
    isLiked: isLiked.value
  })
  
  // 这里可以添加实际的API调用逻辑
  // 例如: likeComment(props.comment.id, isLiked.value)
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transform: translateY(-1px);
}

/* 高级复杂水印样式 */
.comment-with-watermark {
  isolation: isolate;
}

.watermark-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
}

/* 装饰性框架 */
.watermark-frame {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  border: 1px solid rgba(59, 130, 246, 0.05);
  border-radius: inherit;
  opacity: 0;
  animation: frame-fade 8s ease-in-out infinite;
}

/* 几何线条装饰 */
.watermark-geo {
  position: absolute;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  opacity: 0.08;
}

.watermark-geo-1 {
  width: 40px;
  height: 1px;
  top: 15px;
  right: 15px;
  transform-origin: right;
  transform: rotate(-45deg);
  animation: geo-fade 6s ease-in-out infinite;
}

.watermark-geo-2 {
  width: 30px;
  height: 1px;
  bottom: 20px;
  left: 20px;
  transform-origin: left;
  transform: rotate(30deg);
  animation: geo-fade 6s ease-in-out 2s infinite;
}

.watermark-geo-3 {
  width: 25px;
  height: 1px;
  top: 40%;
  right: 12px;
  transform-origin: right;
  transform: rotate(-60deg);
  animation: geo-fade 6s ease-in-out 4s infinite;
}

/* 网格参考线 */
.watermark-grid {
  position: absolute;
  background-color: rgba(59, 130, 246, 0.03);
}

.watermark-grid-h {
  width: 100%;
  height: 1px;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  opacity: 0.5;
}

.watermark-grid-v {
  width: 1px;
  height: 100%;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  opacity: 0.5;
}

/* 侧边装饰 */
.watermark-side-decor {
  position: absolute;
  width: 8px;
  height: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.2;
}

.left-decor {
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.right-decor {
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.watermark-side-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #3b82f6;
  margin-bottom: 4px;
}

.watermark-side-line {
  width: 1px;
  height: 10px;
  background-color: #3b82f6;
}

/* 中心标记 */
.watermark-center-mark {
  position: absolute;
  width: 12px;
  height: 12px;
  right: 25px;
  bottom: 15px;
  opacity: 0.15;
  animation: mark-rotate 20s linear infinite;
}

.center-circle {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid #3b82f6;
  border-radius: 50%;
  top: 0;
  left: 0;
}

.center-plus-h,
.center-plus-v {
  position: absolute;
  background-color: #3b82f6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.center-plus-h {
  width: 6px;
  height: 1px;
}

.center-plus-v {
  width: 1px;
  height: 6px;
}

/* 动画 */
@keyframes frame-fade {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.2; }
}

@keyframes geo-fade {
  0%, 100% { opacity: 0.04; }
  50% { opacity: 0.12; }
}

@keyframes mark-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .watermark-frame {
    border-color: rgba(96, 165, 250, 0.05);
  }
  
  .watermark-geo {
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    opacity: 0.06;
  }
  
  .watermark-grid {
    background-color: rgba(96, 165, 250, 0.03);
  }
  
  .watermark-side-dot,
  .watermark-side-line,
  .center-plus-h,
  .center-plus-v {
    background-color: #60a5fa;
  }
  
  .center-circle {
    border-color: #60a5fa;
  }
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

/* 点赞按钮样式 */
.like-button {
  position: relative;
  overflow: hidden;
}

.like-button:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.like-button.liked {
  color: #3b82f6;
}

.like-icon-wrapper {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.like-icon {
  width: 100%;
  height: 100%;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.liked-icon {
  transform: scale(1.2);
  color: #3b82f6;
}

/* 点赞动画 */
@keyframes like-button-animation {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.liked .like-icon {
  animation: like-button-animation 0.45s ease-in-out;
}

/* 粒子动画 */
.particle {
  opacity: 0;
  transform-origin: center;
}

.particle-1 {
  animation: particle-animation 0.8s ease-out 0.1s forwards;
}

.particle-2 {
  animation: particle-animation 0.8s ease-out 0.2s forwards;
}

.particle-3 {
  animation: particle-animation 0.8s ease-out 0.0s forwards;
}

.particle-4 {
  animation: particle-animation 0.8s ease-out 0.15s forwards;
}

@keyframes particle-animation {
  0% {
    transform: scale(0) translate(0, 0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.2) translate(var(--tx, 5px), var(--ty, -5px));
    opacity: 0;
  }
}

.particle-1 {
  --tx: -5px;
  --ty: -5px;
}

.particle-2 {
  --tx: 5px;
  --ty: -3px;
}

.particle-3 {
  --tx: 7px;
  --ty: 1px;
}

.particle-4 {
  --tx: -2px;
  --ty: 6px;
}

/* 暗色模式点赞 */
@media (prefers-color-scheme: dark) {
  .like-button.liked {
    color: #60a5fa;
  }
  
  .liked-icon {
    color: #60a5fa;
  }
}
</style> 