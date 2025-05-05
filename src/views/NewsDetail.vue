<template>
    <div class="mt-16">
  <!-- 页面头部 -->
  <div class="flex items-center p-5">
    <button @click="handleBack" class="mr-4 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-all">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 prose dark:prose-dark"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </div>

  <div class="flex flex-col lg:flex-row mt-4 px-4 lg:px-8 space-y-6 lg:space-y-0 lg:space-x-8">
    <!-- 主内容区域 -->
    <div class="lg:w-1/2 w-full">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-2xl font-bold mb-2 prose dark:prose-dark">{{ currentNews.title }}</h2>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
            <span class="mr-4">{{ formatTime.getTimeDetail(currentNews.update_time) }}</span>
            <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
              {{ getCategoryName(currentNews.category) }}
            </span>
          </div>
          <div class="divider mb-4">
            <Star class="inline-block w-5 h-5 text-yellow-500" />
          </div>
          <div class="mb-6">
            <div
              class="w-full h-64 bg-cover bg-center rounded-lg shadow-md"
              :style="{ backgroundImage: `url(http://localhost:5200${currentNews.cover})` }"
            ></div>
          </div>
          <div class="prose dark:prose-dark max-w-none" v-html="'&nbsp;' + currentNews.content"></div>
        </div>
      </div>
    </div>

    <!-- 右侧边栏 -->
    <div class="lg:w-1/2 w-full space-y-6">
      <!-- 最近新闻 (置于上方) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6">
          <h3 class="text-xl font-bold mb-4 prose dark:prose-dark border-b border-gray-200 dark:border-gray-700 pb-3">最近新闻</h3>
          <ul class="space-y-3">
            <li
              v-for="(data, index) in topNews"
              :key="data.nid"
              @click="handleChange(data.nid)"
              class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-lg transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
            >
              <div class="flex flex-col">
                <span class="flex items-center mb-1 font-medium">
                  <span v-if="index === 0" class="mr-2 text-yellow-500">🔝</span>
                  <span>{{ index !== 0 ? index : '' }} {{ data.title }}</span>
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatTime.getTimeDetail(data.updateTime) }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- 评论区域 (置于下方) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6">
          <h3 class="text-xl font-bold mb-4 prose dark:prose-dark border-b border-gray-200 dark:border-gray-700 pb-3">用户评论</h3>
          <div class="comments-container h-96 overflow-y-auto pr-2 relative" ref="commentsContainer">
            <CommentList 
              v-if="currentNews.nid"
              target-type="news"
              :target-id="currentNews.nid"
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
  </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import formatTime from "@/utils/formatTime";
import { getNewsDetail, getNewsTopList } from "@/utils/api";
import Star from "@/components/Star.vue";
import CommentList from "@/components/comment/CommentList.vue";

const route = useRoute();
const router = useRouter();

const currentNews = ref([]);
const topNews = ref([]);
const commentsContainer = ref(null);
const showScrollTop = ref(false);

// 新闻分类映射
const categoryMap = {
  '1': '公司新闻',
  '2': '行业资讯',
  '3': '技术分享',
  '4': '最新热点'
};

// 获取分类名称
const getCategoryName = (category) => {
  return categoryMap[category] || '未分类';
};

// 监听评论容器滚动
const handleScroll = () => {
  if (commentsContainer.value) {
    showScrollTop.value = commentsContainer.value.scrollTop > 100;
  }
};

// 滚动到顶部
const scrollToTop = () => {
  if (commentsContainer.value) {
    commentsContainer.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

watchEffect(async () => {
  try {
    const [res, res2] = await Promise.all([
      getNewsDetail(route.params.id),
      getNewsTopList()
    ]);
    console.log(currentNews.nid)
    currentNews.value = res.data.data[0];
    topNews.value = res2.data.data;
  } catch (error) {
    console.error("获取新闻数据失败:", error);
  }
});

onMounted(() => {
  if (commentsContainer.value) {
    commentsContainer.value.addEventListener('scroll', handleScroll);
  }
});

const handleBack = () => {
  router.push(`/news`);
};

const handleChange = (id) => {
  router.push(`/NewsDetail/${id}`);
};
</script>

<style scoped>
.divider {
  border-top: 1px solid #e5e7eb;
  margin: 1rem 0;
}

.transition-colors {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 深色模式适配 */
:deep(.dark .prose) {
  color: #e5e7eb;
}

:deep(.dark .prose h1), 
:deep(.dark .prose h2), 
:deep(.dark .prose h3), 
:deep(.dark .prose h4) {
  color: white;
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
