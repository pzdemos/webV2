<template>
  <div class="container mx-auto px-4 mt-20">
    <!-- 产品展示头部 -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        产品展示
      </h1>
      <p class="subtitle-text">
        创新科技，智慧生活
      </p>
    </div>

    <!-- 产品搜索栏 -->
    <div class="max-w-2xl mx-auto mb-10">
      <div class="relative search-container group">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索产品..."
          class="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/90 dark:border-gray-700 search-input backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md dark:text-gray-200 pl-12"
        />
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
          <svg class="w-6 h-6 text-gray-400 dark:text-gray-500 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" v-if="searchQuery">
          <button
            class="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            @click="searchQuery = ''"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 产品列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-if="loading" class="col-span-full flex justify-center items-center py-12">
        <div class="loading-spinner"></div>
      </div>
      
      <template v-else>
        <div v-for="product in filteredProducts" :key="product.pid" 
             class="product-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
          <!-- 产品图片 -->
          <div class="relative h-48 overflow-hidden group cursor-pointer" @click="navigateToDetail(product)">
            <ImageLoader
              :src="getImageUrl(product.cover)" 
              :alt="product.title"
              imageClass="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div class="p-4 w-full">
                <p class="text-white text-sm font-medium">查看详情</p>
              </div>
            </div>
          </div>
          
          <!-- 产品信息 -->
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" @click="navigateToDetail(product)">
              {{ product.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {{ product.introduction }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime.getTime(product.updateTime) }}
              </span>
              <button @click="navigateToDetail(product)" 
                      class="btn-more px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg transition-all duration-300">
                了解更多
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 无数据展示 -->
    <div v-if="!loading && filteredProducts.length === 0" class="col-span-full">
      <Empty description="暂无产品数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getProductList } from '@/utils/api'
import formatTime from '@/utils/formatTime'
import { getImageUrl } from '@/utils/imageUrl';
import Empty from '@/components/Empty.vue'
import ImageLoader from '@/components/ImageLoader.vue'

const router = useRouter()
const products = ref([])
const loading = ref(true)
const searchQuery = ref('')

// 获取产品列表
const getProducts = async () => {
  try {
    const res = await getProductList()
    products.value = res.data.data
  } catch (error) {
    console.error('获取产品列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 过滤产品
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(product => 
    product.title.toLowerCase().includes(query) ||
    product.introduction.toLowerCase().includes(query)
  )
})

// 导航到产品详情页
const navigateToDetail = (product) => {
  router.push(`/product/${product.pid}`)
}

onMounted(() => {
  getProducts()
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

.product-card {
  position: relative;
  isolation: isolate;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: transparent;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(139, 92, 246, 0.1);
}

.product-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
  z-index: -1;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover::before {
  opacity: 1;
}

.product-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: white;
  z-index: -1;
  border-radius: inherit;
  transition: opacity 0.3s ease;
}

.dark .product-card::after {
  background: #1f2937;
}

.btn-more {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-more::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(45deg, #4f46e5, #7e22ce);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-more:hover::after {
  opacity: 1;
}

.product-modal {
  animation: modal-in 0.3s ease forwards;
  transform-origin: center;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
}

.product-content {
  -webkit-overflow-scrolling: touch; /* 增强iOS滚动体验 */
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.product-content::-webkit-scrollbar {
  width: 6px;
}

.product-content::-webkit-scrollbar-track {
  background: transparent;
}

.product-content::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .product-card {
    margin-bottom: 1rem;
  }
  
  .product-modal {
    width: 95%;
    max-height: 85vh;
  }
}

/* 深色模式适配 */
.dark .product-card {
  background: rgba(31, 41, 55, 0.8);
}

.dark .loading-spinner {
  border-color: #374151;
  border-top-color: #60a5fa;
}

.dark .product-card::before {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
}

.dark .prose {
  color: #e5e7eb;
}

.dark .prose h1, 
.dark .prose h2, 
.dark .prose h3, 
.dark .prose h4 {
  color: white;
}
/* 搜索框样式 */
.search-input {
  transition: all 0.3s ease;
}

.search-container:hover .search-input {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.search-input:focus {
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

[data-theme="light"] .search-input {
  background-color: rgba(255, 255, 255, 0.9);
  border-color: #e2e8f0;
  color: #334155;
}

[data-theme="light"] .search-input::placeholder {
  color: #94a3b8;
}

[data-theme="dark"] .search-input {
  background-color: rgba(31, 41, 55, 0.8);
  border-color: #374151;
}

[data-theme="dark"] .search-input:focus {
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

[data-theme="light"] .subtitle-text {
  color: #64748b;
}

[data-theme="dark"] .subtitle-text {
  color: #94a3b8;
}

/* 添加搜索框点击效果 */
.search-container:active .search-input {
  transform: scale(0.98);
}
</style>
