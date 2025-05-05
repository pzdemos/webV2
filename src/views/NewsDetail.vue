<template>
    <div class="mt-16">
  <!-- 页面头部 -->
  <div class="flex items-center p-5">
    <button @click="handleBack" class="mr-4">
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
    <div class="lg:w-2/3 w-full">
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
          class="w-full h-64 bg-cover bg-center rounded shadow-md"
          :style="{ backgroundImage: `url(http://localhost:5200${currentNews.cover})` }"
        ></div>
      </div>
      <div class="prose dark:prose-dark" v-html="'&nbsp;' + currentNews.content"></div>
      
      <!-- 评论区域 -->
      <div class="mt-10">
        <CommentList 
          v-if="currentNews.nid"
          target-type="news"
          :target-id="currentNews.nid"
        />
      </div>
    </div>

    <!-- 侧边栏 -->
    <div class="lg:w-1/4 w-full lg:mt-0 mt-6">  
      <div class="rounded-lg shadow-lg">
        <div class="p-4">
          <h3 class="mb-4 text-lg font-bold prose dark:prose-dark">最近新闻</h3>
          <ul class="space-y-3">
            <li
              v-for="(data, index) in topNews"
              :key="data.nid"
              @click="handleChange(data.nid)"
              class="p-3 hover:text-primary active:text-success cursor-pointer rounded transition-colors duration-200"
            >
              <div class="flex flex-col">
                <span class="flex items-center mb-1">
                  <span v-if="index === 0" class="mr-2">🔝</span>
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
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import formatTime from "@/utils/formatTime";
import { getNewsDetail, getNewsTopList } from "@/utils/api";
import Star from "@/components/Star.vue";
import CommentList from "@/components/comment/CommentList.vue";

const route = useRoute();
const router = useRouter();

const currentNews = ref([]);
const topNews = ref([]);

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
</style>
