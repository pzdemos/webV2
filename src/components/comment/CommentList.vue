<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:shadow-xl transition duration-300">
    <div class="bg-gradient-to-r from-blue-500/90 to-purple-500/90 p-4 flex items-center justify-between">
      <h3 class="text-xl font-bold text-white flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span>评论</span>
        <span class="inline-flex items-center justify-center bg-white/20 text-white text-sm rounded-full w-6 h-6 ml-2">
          {{ totalComments }}
        </span>
      </h3>
      <button 
        @click="refreshComments" 
        class="text-white hover:text-blue-100 transition-all duration-300 flex items-center text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full"
        :disabled="loading"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-4 w-4 mr-1" 
          :class="{ 'animate-spin': loading }"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        刷新
      </button>
    </div>
    
    <div class="p-4">
      <!-- 评论输入表单 -->
      <CommentForm 
        :target-type="targetType" 
        :target-id="targetId"
        @comment-added="refreshComments" 
      />
      
      <!-- 评论列表 -->
      <div v-if="loading && !hasLoadedOnce" class="py-8 text-center text-gray-500 dark:text-gray-400">
        <div class="loading-bubble">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="mt-3 animate-pulse">加载评论中...</p>
      </div>
      
      <div v-else-if="comments.length === 0" class="py-8 text-center">
        <div class="empty-animation mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 14.042 3 12.574 3 11c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-lg font-medium">暂无评论</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-1">来发表第一条评论吧！</p>
      </div>
      
      <TransitionGroup 
        name="comment-list" 
        tag="div" 
        class="space-y-1"
        v-else
      >
        <CommentItem 
          v-for="comment in comments" 
          :key="comment.id" 
          :comment="comment"
          @comment-deleted="handleCommentDeleted"
        />
      </TransitionGroup>
      
      <!-- 加载更多 -->
      <div v-if="comments.length > 0 && hasMoreComments" class="text-center py-4">
        <button 
          @click="loadMoreComments" 
          class="group px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 rounded-full text-sm transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400"
          :disabled="loading"
        >
          <span v-if="loading" class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </span>
          <span v-else class="inline-flex items-center">
            加载更多
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transform group-hover:translate-y-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getCommentList } from '@/utils/api'
import { ElMessage } from 'element-plus'
import CommentItem from '@/components/comment/CommentItem.vue'
import CommentForm from '@/components/comment/CommentForm.vue'
import { TransitionGroup } from 'vue'

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

const comments = ref([])
const loading = ref(false)
const hasLoadedOnce = ref(false)
const page = ref(1)
const pageSize = ref(10)
const totalCommentCount = ref(0)

// 计算是否有更多评论可加载
const hasMoreComments = computed(() => {
  return comments.value.length < totalCommentCount.value
})

// 计算评论显示数量
const totalComments = computed(() => totalCommentCount.value)

// 获取评论列表
const fetchComments = async (refresh = false) => {
  if (refresh) {
    page.value = 1
    comments.value = []
  }
  
  loading.value = true
  try {
    const res = await getCommentList(props.targetType, props.targetId, page.value)
    const data = res.data.data
    
    // 更新总评论数
    totalCommentCount.value = data.total
    
    if (refresh) {
      comments.value = data.comments || []
    } else {
      comments.value = [...comments.value, ...(data.comments || [])]
    }
    
    hasLoadedOnce.value = true
  } catch (error) {
    console.error('获取评论列表失败:', error)
    ElMessage.error('获取评论失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

// 刷新评论
const refreshComments = () => {
  fetchComments(true)
}

// 加载更多评论
const loadMoreComments = () => {
  page.value++
  fetchComments()
}

// 处理评论删除
const handleCommentDeleted = (commentId) => {
  comments.value = comments.value.filter(comment => comment.id !== commentId)
  // 减少总评论数
  totalCommentCount.value--
}

// 监听targetId变化，重新加载评论
watch(() => props.targetId, () => {
  page.value = 1
  fetchComments(true)
})

// 组件挂载时加载评论
onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-bubble {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.loading-bubble span {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #60a5fa;
  animation: bubble-bounce 1.5s infinite ease-in-out;
}

.loading-bubble span:nth-child(1) {
  animation-delay: 0s;
}

.loading-bubble span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-bubble span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bubble-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
  40% { transform: scale(1); opacity: 1; }
}

.empty-animation {
  opacity: 0.7;
  animation: pulse-and-float 3s infinite ease-in-out;
}

@keyframes pulse-and-float {
  0%, 100% { transform: translateY(0); opacity: 0.7; }
  50% { transform: translateY(-10px); opacity: 0.9; }
}

/* 列表过渡动画 */
.comment-list-enter-active,
.comment-list-leave-active {
  transition: all 0.5s ease;
}

.comment-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.comment-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.comment-list-move {
  transition: transform 0.5s ease;
}
</style> 