<template>
  <div class="container mx-auto px-4 mt-20">
    <!-- 产品展示头部 -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        产品展示
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        创新科技，智慧生活
      </p>
    </div>

    <!-- 产品搜索栏 -->
    <div class="max-w-2xl mx-auto mb-8">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索产品..."
          class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
        <span class="absolute right-3 top-2.5">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
    </div>

    <!-- 产品列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-if="loading" class="col-span-full flex justify-center items-center py-12">
        <div class="loading-spinner"></div>
      </div>
      
      <template v-else>
        <div v-for="product in filteredProducts" :key="product.pid" 
             class="product-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <!-- 产品图片 -->
          <div class="relative h-48 overflow-hidden">
            <img 
              :src="`http://localhost:5200${product.cover}`" 
              :alt="product.title"
              class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-4 left-4 text-white">
                <p class="text-sm">查看详情</p>
              </div>
            </div>
          </div>
          
          <!-- 产品信息 -->
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              {{ product.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {{ product.introduction }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime.getTime(product.updateTime) }}
              </span>
              <button @click="showProductDetail(product)" 
                      class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                了解更多
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 产品详情弹窗 -->
    <div v-if="selectedProduct" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
         @click.self="selectedProduct = null">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="relative">
          <button @click="selectedProduct = null" 
                  class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            :src="`http://localhost:5200${selectedProduct.cover}`" 
            :alt="selectedProduct.title"
            class="w-full h-64 object-cover"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {{ selectedProduct.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4" v-html="selectedProduct.introduction"></p>
            <div class="prose dark:prose-invert mb-8" v-html="selectedProduct.detail"></div>
            
            <!-- 产品评论区 -->
            <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <CommentList 
                target-type="product"
                :target-id="selectedProduct.pid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无数据展示 -->
    <div v-if="!loading && filteredProducts.length === 0" class="col-span-full">
      <Empty description="暂无产品数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getProductList } from '@/utils/api'
import formatTime from '@/utils/formatTime'
import Empty from '@/components/Empty.vue'
import CommentList from '@/components/comment/CommentList.vue'

const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedProduct = ref(null)

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

// 显示产品详情
const showProductDetail = (product) => {
  selectedProduct.value = product
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
}

.product-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  z-index: -1;
  margin: -0.5px;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover::after {
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .product-card {
    margin-bottom: 1rem;
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
</style>
