<template>
  <div class="container mx-auto px-4 pt-20 pb-12">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="loading-spinner"></div>
    </div>
    
    <template v-else-if="product">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <button @click="goBack" 
                class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回产品列表
        </button>
      </div>

      <!-- 产品头部信息 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
        <div class="relative h-72 md:h-96 bg-gray-900">
          <ImageLoader 
            :src="getImageUrl(product.cover)" 
            :alt="product.title"
            imageClass="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
          
          <!-- 标题覆盖 -->
          <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <h1 class="text-3xl md:text-4xl font-bold text-white">
              {{ product.title }}
            </h1>
            <p class="text-white/80 mt-2">
              更新时间: {{ formatTime.getTime(product.updateTime) }}
            </p>
          </div>
        </div>
      </div>

      <!-- 响应式内容区域：大屏左右布局，小屏上下布局 -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 左侧：产品信息 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex-1">
          <div class="p-6">
            <!-- 价格信息 -->
            <div class="flex flex-wrap items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <span class="text-2xl font-bold text-gray-800 dark:text-white">¥{{ product.price }}</span>
                <span class="ml-2 text-gray-500 dark:text-gray-400">参考价格</span>
              </div>
              <div class="flex space-x-2 mt-2 sm:mt-0">
                <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <span>咨询详情</span>
                </button>
                <button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors">
                  <span>收藏</span>
                </button>
              </div>
            </div>

            <!-- 产品简介 -->
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h2 class="text-xl font-bold mb-3 text-gray-800 dark:text-white">产品简介</h2>
              <p class="text-gray-700 dark:text-gray-300" v-html="product.introduction"></p>
            </div>
          </div>
        </div>
        
        <!-- 右侧：评论区 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden lg:w-1/3">
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              用户评论
            </h2>
            <div class="comments-container h-96 overflow-y-auto pr-2 relative" ref="commentsContainer">
              <CommentList 
                target-type="product"
                :target-id="product.pid"
              />
              
              <!-- 滚动到顶部按钮 -->
              <button 
                v-show="showScrollTop" 
                @click="scrollToTop"
                class="scroll-top-btn fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 无数据展示 -->
    <div v-if="!loading && !product" class="py-12">
      <Empty description="未找到产品信息" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductDetail } from '@/utils/api'
import formatTime from '@/utils/formatTime'
import { getImageUrl } from '@/utils/imageUrl';
import Empty from '@/components/Empty.vue'
import CommentList from '@/components/comment/CommentList.vue'
import ImageLoader from '@/components/ImageLoader.vue'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)
const commentsContainer = ref(null)
const showScrollTop = ref(false)

// 获取产品详情
const getProduct = async () => {
  try {
    const productId = route.params.id
    if (!productId) {
      return router.push('/product')
    }
    
    const res = await getProductDetail(productId)
    product.value = res.data.data
  } catch (error) {
    console.error('获取产品详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 返回产品列表
const goBack = () => {
  router.push('/product')
}

// 监听评论容器滚动
const handleScroll = () => {
  if (commentsContainer.value) {
    showScrollTop.value = commentsContainer.value.scrollTop > 100
  }
}

// 滚动到顶部
const scrollToTop = () => {
  if (commentsContainer.value) {
    commentsContainer.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

onMounted(() => {
  getProduct()
  
  // 添加滚动监听
  if (commentsContainer.value) {
    commentsContainer.value.addEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped>
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding-top: 4rem;
  }
}

.prose img {
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

/* 滚动条样式 */
.comments-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.comments-container::-webkit-scrollbar {
  width: 6px;
}

.comments-container::-webkit-scrollbar-track {
  background: transparent;
}

.comments-container::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.comments-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}
</style> 