<template>
  <div class="container mx-auto p-2">
    <!-- 新闻头部 -->
    <div class="news-header h-64 md:h-96 rounded-lg shadow-lg relative overflow-hidden">
      <ImageLoader
        :src="newsBgImage"
        alt="News Background"
        imageClass="w-full h-full object-cover"
      />
      <!-- 可添加标题或其他内容 -->
    </div>

    <!-- 搜索栏 -->
    <div class="my-6">
      <div class="relative flex justify-center w-full">
        <div class="relative w-full max-w-2xl">
          <input
            type="text"
            v-model="searchText"
            placeholder="请输入新闻关键词"
            class="input w-full pr-12 pl-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md dark:text-gray-200"
            @keyup.enter="goNewsDetail(firstID)"
            @input="visible=true"
            @blur="handleBlur"
          />
          <button
            class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            @click="visible=true"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="transition-transform duration-300 transform group-hover:scale-110">
              <path
                d="M21 21L15 15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 搜索结果下拉框 -->
      <div v-if="visible" class="relative w-full max-w-2xl mx-auto mt-2">
        <div class="absolute bg-white/95 dark:bg-gray-800/95 backdrop-blur-md w-full z-10 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 animate-fadeIn">
          <div v-if="searchNewsList.length" class="max-h-80 overflow-y-auto">
            <div
              v-for="item in searchNewsList"
              :key="item.nid"
              class="p-4 hover:bg-blue-50/70 dark:hover:bg-gray-700/70 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-300 flex items-center"
              @click="goNewsDetail(item.nid)"
            >
              {{ item.title }}
            </div>
          </div>
          <div v-else class="p-4">
            <Empty description="暂无搜索结果" :image-size="50" />
          </div>
        </div>
      </div>
    </div>

    <!-- 顶部新闻 -->
    <div class="top-news grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="item in topNewsList"
        :key="item.nid"
        class="card bg-base-100 shadow-md hover:shadow-xl transition-shadow rounded-lg cursor-pointer news-card border border-gray-700/30 hover:border-blue-500/30 overflow-hidden"
        @click="goNewsDetail(item.nid)"
      >
        <div class="h-40 w-full relative group overflow-hidden p-0 m-0">
          <ImageLoader
            :src="getImageUrl(item.cover)"
            alt="News Image"
            imageClass="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            style="display: block; margin: 0; padding: 0;"
          />
        </div>
        <div class="card-body p-4">
          <h2 class="card-title text-lg font-semibold light:text-black dark:text-primary-light">
            {{ item.title }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatTime.getTime(item.updateTime) }}
          </p>
        </div>
      </div>
    </div>

    <!-- 分类标签页与时间轴 -->
    <div class="mt-8">
      <div class="flex flex-col lg:flex-row lg:space-x-6">
        <!-- 分类标签 -->
        <div class="w-full lg:w-1/2">
          <ul class="flex justify-center items-center rounded-t-lg overflow-hidden border-b-2 border-gray-300 dark:border-gray-700 max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800">
            <li
              v-for="(tab, index) in tabList"
              :key="tab.name"
              :class="[
                'flex-1',
                index === 0 ? 'first:rounded-tl-lg' : '',
                index === tabList.length - 1 ? 'last:rounded-tr-lg' : ''
              ]"
            >
              <a
                href="#"
                @click.prevent="activeName = tab.name"
                :class="activeName === tab.name ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white border-b-0' : 'text-gray-500 dark:text-gray-400 border-b-2 border-transparent bg-gray-50 dark:bg-gray-800'"
                class="flex w-full py-3 px-5 md:px-8 font-medium items-center justify-center transition-all duration-300 ease-in-out hover:bg-blue-50 dark:hover:bg-blue-900/10 whitespace-nowrap overflow-hidden text-ellipsis min-h-[3rem]"
              >
                {{ tab.label }}
              </a>
            </li>
          </ul>
          <div class="mt-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- 新闻列表 -->
              <div v-for="item in tabNews[activeName]" :key="item.nid">
                <div
                  class="border border-gray-700/30 mb-4 rounded-lg p-4 cursor-pointer hover:bg-gray-100/10 hover:border-blue-500/30 transition-all duration-300 bg-white dark:bg-gray-800/90 shadow-sm hover:shadow-md"
                  @click="goNewsDetail(item.nid)"
                >
                  <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
                    <div class="w-full md:w-32 h-48 md:h-24 rounded-lg mb-4 md:mb-0 flex-shrink-0 overflow-hidden">
                      <ImageLoader
                        :src="getImageUrl(item.cover)"
                        alt="News Image"
                        imageClass="w-full h-full object-cover"
                        style="display: block; margin: 0; padding: 0;"
                      />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold light:text-black dark:text-primary-light mb-2">
                        {{ item.title }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ formatTime.getTime(item.updateTime) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 时间轴 - 添加 hidden lg:block 类来控制显示 -->
        <div class="hidden lg:block w-full lg:w-1/2 mt-8 lg:mt-0">
          <h2 class="text-xl font-bold mb-4 text-center lg:text-left">新闻时间轴</h2>
          <div class="relative">
            <div class="border-l-2 border-gradient-to-r from-blue-500 to-teal-500 absolute h-full top-0 left-4"></div>
            <ul class="list-none m-0 p-0">
              <li
                v-for="(data, index) in tabNews[activeName]"
                :key="index"
                class="mb-8 lg:mb-10 ml-8 lg:ml-10 relative"
              >
                <div class="absolute -left-5 top-1.5 w-4 h-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-bounce"></div>
                <div
                  class="light:bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer transform hover:translate-x-1 hover:scale-105"
                  @click="goNewsDetail(data.nid)"
                >
                  <h3 class="text-lg font-semibold light:text-black dark:text-primary-light mb-1">
                    {{ data.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ formatTime.getTimeDetail(data.updateTime) }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <button
      class="fixed"
      @click="scrollToTop"
      :class="{
        'dark:from-gray-700 dark:to-gray-600 dark:hover:from-teal-600 dark:hover:to-green-600': true
      }"
    >
      <span class="sr-only">返回顶部</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getNewsList, getWebsiteConfigs } from "@/utils/api";
import formatTime from "@/utils/formatTime";
import { useRouter } from "vue-router";
import ImageLoader from "@/components/ImageLoader.vue";
import Empty from "@/components/Empty.vue";
// lodash已移除，使用原生JavaScript实现分组功能
import { getImageUrl } from '@/utils/imageUrl';

const searchText = ref("");
const visible = ref(false);
const newlist = ref([]);
const topNewsList = ref([]);
const router = useRouter();
const newsBgImage = ref(getImageUrl("/asset/new-bg.jpg"));

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

// 分类标签
const tabList = ref([
  {
    label: "公司新闻",
    name: "1",
  },
  {
    label: "行业资讯",
    name: "2",
  },
  {
    label: "技术分享",
    name: "3",
  },
  {
    label: "最新热点",
    name: "4",
  },
]);

const activeName = ref(tabList.value[0].name);

// 根据分类分组（确保category作为字符串处理）- 原生JavaScript实现
const tabNews = computed(() => {
  return newlist.value.reduce((acc, item) => {
    const category = String(item.category);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
});

// 获取新闻列表和网站配置
onMounted(async () => {
  try {
    // 获取新闻列表
    console.log('News组件：开始获取新闻列表...');
    const newsRes = await getNewsList();
    if (newsRes.data && newsRes.data.data) {
      newlist.value = newsRes.data.data;
      topNewsList.value = newlist.value;
      console.log('News组件：获取到新闻数据', newlist.value.length, '条');
    } else {
      console.warn('News组件：新闻数据格式不正确', newsRes.data);
    }
  } catch (error) {
    console.error('获取新闻列表失败:', error);
  }
  
  // 获取网站配置
  try {
    console.log('News组件：开始获取背景图配置...');
    const configRes = await getWebsiteConfigs();
    console.log('News组件：获取配置响应', configRes);
    
    if (configRes.data && configRes.data.data) {
      const configs = configRes.data.data;
      console.log('News组件：获取到配置数据', configs);
      
      if (configs.news_bg_image) {
        console.log('News组件：设置背景图为', configs.news_bg_image);
        newsBgImage.value = getImageUrl(configs.news_bg_image);
      } else {
        console.warn('News组件：未找到news_bg_image配置，使用默认值');
      }
    } else {
      console.warn('News组件：响应数据格式不正确', configRes.data);
    }
  } catch (error) {
    console.error('获取新闻背景图失败:', error);
  }
});

// 计算搜索结果
const searchNewsList = computed(() => {
  return searchText.value
    ? newlist.value.filter((item) =>
        item.title.includes(searchText.value)
      )
    : [];
});

// 跳转详情页
const goNewsDetail = (nid) => {
  router.push(`/NewsDetail/${nid}`);
};

// 获取第一个新闻ID
const firstID = computed(
  () => (newlist.value.length > 0 ? newlist.value[0].nid : null)
);

// 处理搜索框失焦
const handleBlur = () => {
  setTimeout(() => {
    visible.value = false;
  }, 200);
};

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style scoped>
/* 全局容器调整 */
.container {
  padding: 1rem;
  padding-top: 80px;
}

/* 新闻头部 */
.news-header {
  width: 100%;
  height: 16rem;
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 搜索栏 */
.input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* Tailwind primary color */
}

/* 顶部新闻卡片 */
.top-news .card img {
  transition: transform 0.3s;
  display: block;
  margin: 0;
  padding: 0;
}

.top-news .card:hover img {
  transform: scale(1.05);
}

/* 确保图片容器没有内部间距，紧贴边框 */
.news-card > div:first-child,
.overflow-hidden {
  padding: 0;
  margin: 0;
  line-height: 0;
}

/* 确保所有图片组件内的图片没有默认间距 */
.news-card img,
.overflow-hidden img {
  display: block;
  margin: 0;
  padding: 0;
  line-height: 0;
}

/* 分类标签容器 */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.flex {
  display: flex;
}

/* 自定义分类标签样式 */
.bg-primary {
  background-image: linear-gradient(to right, #3b82f6, #1e40af); /* 更丰富的渐变色 */
  color: #ffffff; /* 白色文字 */
}

.text-primary {
  color: #3b82f6;
}

/* 时间轴 */
.relative .border-l-2 {
  border-left-width: 2px;
  background: linear-gradient(to bottom, #3b82f6, #14b8a6); /* 渐变色 */
}

.relative .bg-gradient-to-r {
  background-image: linear-gradient(to right, #3b82f6, #14b8a6);
}

.tab-timeline-link {
  cursor: pointer;
}

.tab-timeline-link:hover {
  color: #10b981; /* Tailwind green-500 */
  text-decoration: underline;
}

/* 返回顶部按钮 */
button.fixed {
  bottom: 20px;
  right: 20px;
  width: 26px;
  height: 42px;
  border-radius: 13px;
  background: rgba(59, 130, 246, 0.8); /* 增加不透明度 */
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.5); /* 更明显的边框 */
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(0);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 添加阴影 */
}

button.fixed::before {
  content: "";
  position: absolute;
  top: 6px;
  width: 2px;
  height: 10px;
  background: #fff;
  border-radius: 1px;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.8); /* 添加发光效果 */
  animation: blink 2s infinite; /* 添加闪烁动画 */
}

button.fixed:hover {
  background: rgba(59, 130, 246, 0.95);
  transform: translateY(-3px) scale(1.05); /* 添加缩放效果 */
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); /* 悬浮时增强阴影 */
  border-color: rgba(255, 255, 255, 0.8);
}

button.fixed {
  background: rgba(75, 85, 99, 0.8);
  border-color: rgba(255, 255, 255, 0.3);
}

button.fixed:hover {
  background: rgba(16, 185, 129, 0.95); /* 使用绿色 */
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

/* 添加闪烁动画 */
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 搜索结果淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}

/* 移除原有的箭头文本 */
button.fixed span {
  display: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .news-header {
    height: 12rem;
  }

  .top-news {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .search-item {
    padding: 0.75rem;
    height: auto;
  }

  .tab-timeline {
    margin: 10px;
  }

  .tab-image {
    width: 100px;
    height: 70px;
  }

  .content {
    overflow: hidden;
  }

  /* 调整时间轴的布局以适应手机屏幕 */
  .relative {
    position: relative;
  }

  .relative .border-l-2 {
    border-left-width: 2px;
    background: linear-gradient(to bottom, #3b82f6, #14b8a6);
    display: block; /* 确保显示 */
    left: 16px; /* 调整左边距 */
  }

  .relative .bg-gradient-to-r {
    background-image: linear-gradient(to right, #3b82f6, #14b8a6);
    display: block; /* 确保显示 */
  }

  .tab-timeline-link {
    display: block; /* 确保显示 */
  }

  /* 时间轴节点动画 */
  .time-node {
    animation: bounce 2s infinite;
  }

  /* 确保时间轴内容在手机端有足够的间距 */
  ul.list-none {
    padding-left: 2rem; /* 增加左边距以适应时间轴 */
  }

  li.mb-8 {
    margin-bottom: 2rem; /* 增加底部间距 */
  }

  /* 调整时间轴内容的宽度 */
  .relative .bg-white,
  .relative .dark\:bg-gray-800 {
    width: calc(100% - 3rem); /* 调整宽度以适应移动端 */
  }

  /* 保持返回顶部按钮的样式 */
  button.fixed {
    bottom: 16px;
    right: 16px;
    width: 24px;
    height: 38px;
  }
  ul.news-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
}

/* 确保图片容器没有内部间距，紧贴边框 */
.news-card > div:first-child,
.overflow-hidden {
  padding: 0;
  margin: 0;
  line-height: 0;
}

/* 确保ImageLoader组件内的图片没有默认间距 */
.news-card img,
.overflow-hidden img {
  display: block;
  margin: 0;
  padding: 0;
  line-height: 0;
}

  ul {
    display: flex;
    justify-content: center;
    gap: 0.5rem; /* 使用gap代替margin */
  }

  ul li {
    flex: 1 1 0;
    max-width: none;
    width: calc(33.333% - 0.666rem); /* 确保三个标签在一行显示 */
  }

  ul li a {
    padding: 0.5rem 0;
    font-size: 0.875rem;
    text-align: center;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .news-header {
    height: 14rem;
  }

  .tab-image {
    width: 120px;
    height: 80px;
  }
}
</style>
