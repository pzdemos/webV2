<template>
  <div class="navbar fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
    <!-- 品牌名称 -->
    <div class="flex-1">
      <a class="btn btn-ghost font-serif text-xl md:text-2xl group">
        <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
          {{ brandName }}
        </span>
        <div class="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"></div>
      </a>
    </div>

    <!-- 移动端汉堡菜单 -->
    <div class="flex-none md:hidden">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost text-gray-200 hover:bg-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-slate-900/95 backdrop-blur rounded-box w-52 border border-white/10">
          <li v-for="(item, index) in filteredMenuItems" :key="index">
            <template v-if="item.external">
              <a :href="item.path" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                {{ item.name }}
              </a>
            </template>
            <template v-else>
              <router-link :to="item.path" active-class="active" class="text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                {{ item.name }}
              </router-link>
            </template>
          </li>
          <!-- 登出按钮（仅在登录状态下显示） -->
          <li v-if="userStore.isLoggedIn()">
            <a @click="handleLogout" class="text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              登出
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 桌面端菜单 -->
    <div class="hidden md:flex flex-1 justify-center">
      <ul class="menu menu-horizontal px-1 gap-2">
        <li v-for="(item, index) in filteredMenuItems" :key="index" class="menu-item-wrapper">
          <template v-if="item.external">
            <a :href="item.path" target="_blank" rel="noopener noreferrer" class="nav-link text-gray-300 hover:text-white transition-all duration-300">
              {{ item.name }}
            </a>
          </template>
          <template v-else>
            <router-link :to="item.path" active-class="active" class="nav-link text-gray-300 hover:text-white transition-all duration-300">
              {{ item.name }}
            </router-link>
          </template>
        </li>
      </ul>
    </div>

    <!-- 用户区域 -->
    <div class="flex-none ml-2">
      <div v-if="userStore.isLoggedIn()" class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost flex items-center gap-1">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {{ userStore.username.charAt(0).toUpperCase() }}
          </div>
          <span class="hidden md:inline text-gray-300">{{ userStore.username }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-slate-900/95 backdrop-blur rounded-box w-52 border border-white/10">
          <li>
            <a @click="handleLogout" class="text-gray-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </a>
          </li>
        </ul>
      </div>
      <router-link 
        v-else 
        to="/login" 
        class="hidden md:flex btn btn-sm btn-outline bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300"
      >
        登录
      </router-link>
    </div>

    <!-- 主题切换器 -->
    <ThemeSwitcher class="ml-4" />

    <!-- 装饰元素 -->
    <div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ThemeSwitcher from "@/components/ThemeSwitcher.vue";
import { useUserStore } from '@/stores/user';
import { getWebsiteConfigs } from "@/utils/api";

const router = useRouter();
const userStore = useUserStore();
const brandName = ref('SMart-ck'); // 默认值

const menuItems = [
  { name: '首页', path: '/' },
  { name: '新闻中心', path: '/news' },
  { name: '产品服务', path: '/product' },
  { name: '登录', path: '/login', hideWhenLoggedIn: true },
];

// 根据登录状态过滤菜单项
const filteredMenuItems = computed(() => {
  if (userStore.isLoggedIn()) {
    return menuItems.filter(item => !item.hideWhenLoggedIn);
  }
  return menuItems;
});

// 处理登出
const handleLogout = () => {
  userStore.logout();
  router.push('/');
};

// 获取网站配置
onMounted(async () => {
  try {
    const res = await getWebsiteConfigs();
    
    if (res.data && res.data.data) {
      const configs = res.data.data;
      
      if (configs.brand_name) {
        brandName.value = configs.brand_name;
      } else {
        console.warn('Navbar组件：未找到brand_name配置，使用默认值');
      }
    } else {
      console.warn('Navbar组件：响应数据格式不正确', res.data);
    }
  } catch (error) {
    console.error('获取品牌名称失败:', error);
  }
});
</script>

<style scoped>
.nav-link {
  position: relative;
  padding: 0.5rem 1rem;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #60a5fa, #a855f7);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.menu-item-wrapper {
  position: relative;
  overflow: hidden;
}

.menu-item-wrapper::before {
  content: '';
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1));
  transition: transform 0.3s ease;
}

.menu-item-wrapper:hover::before {
  transform: translateY(100%);
}

.active {
  background: linear-gradient(to right, rgba(96, 165, 250, 0.1), rgba(168, 85, 247, 0.1));
  border-radius: 0.5rem;
}

/* 添加呼吸光效果 */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(96, 165, 250, 0.3); }
  50% { box-shadow: 0 0 15px rgba(168, 85, 247, 0.5); }
}

.navbar {
  animation: glow 3s infinite;
}
</style>
