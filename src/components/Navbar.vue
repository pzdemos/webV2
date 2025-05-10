<template>
  <div class="navbar fixed top-0 left-0 right-0 z-50 backdrop-blur-lg nav-bg border-b">
    <!-- 品牌名称 -->
    <div class="flex-1" @click="router.push('/')">
      <a class="btn btn-ghost font-serif text-xl md:text-2xl group">
        <span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
          {{ brandName }}
        </span>
        <div class="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"></div>
      </a>
    </div>

    <!-- 移动端空间占位 -->
    <div class="flex-none md:hidden"></div>

    <!-- 桌面端菜单 -->
    <div class="hidden md:flex flex-1 justify-center">
      <ul class="menu menu-horizontal px-1 gap-2">
        <li v-for="(item, index) in filteredMenuItems" :key="index" class="menu-item-wrapper">
          <template v-if="item.external">
            <a :href="item.path" target="_blank" rel="noopener noreferrer" class="nav-link nav-text transition-all duration-300">
              {{ item.name }}
            </a>
          </template>
          <template v-else>
            <router-link :to="item.path" active-class="active" class="nav-link nav-text transition-all duration-300">
              {{ item.name }}
            </router-link>
          </template>
        </li>
      </ul>
    </div>

    <!-- 用户区域 -->
    <div class="flex-none ml-2 mr-4">
      <div v-if="userStore.isLoggedIn()" class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost flex items-center gap-1">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {{ userStore.username.charAt(0).toUpperCase() }}
          </div>
          <span class="hidden md:inline nav-text">{{ userStore.username }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 nav-text opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg nav-dropdown backdrop-blur rounded-box w-52 border">
          <li>
            <router-link to="/profile" class="nav-text">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              个人中心
            </router-link>
          </li>
          <li>
            <a @click="handleLogout" class="nav-text">
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
        class="hidden md:flex btn btn-sm login-btn relative overflow-hidden group transition-all duration-300 px-6"
      >
        <span class="relative z-10">登录</span>
        <span class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
      </router-link>
    </div>


    <!-- 装饰元素 -->
    <div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
  </div>

  <!-- 手机端底部菜单 -->  
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg nav-bg border-t">
    <div class="flex justify-around items-center h-14">
      <router-link 
        v-for="(item, index) in filteredMenuItems" 
        :key="index" 
        :to="item.path" 
        active-class="active-mobile" 
        class="flex flex-col items-center justify-center w-full h-full nav-link-mobile nav-text px-2 transition-all duration-300"
      >
        <span class="text-xs">{{ item.name }}</span>
        <div class="w-0 hover:w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"></div>
      </router-link>
      
      <!-- 登录/我的按钮 -->
      <router-link 
        v-if="!userStore.isLoggedIn()" 
        to="/login" 
        class="flex flex-col items-center justify-center w-full h-full nav-link-mobile nav-text px-2 transition-all duration-300"
      >
        <span class="text-xs">登录</span>
      </router-link>
      <router-link 
        v-else 
        to="/profile" 
        class="flex flex-col items-center justify-center w-full h-full nav-link-mobile nav-text px-2 transition-all duration-300"
      >
        <span class="text-xs">我的</span>
      </router-link>
    </div>
    
    <!-- 装饰元素 -->
    <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { getWebsiteConfigs } from "@/utils/api";

const router = useRouter();
const userStore = useUserStore();
const brandName = ref('SMart-ck'); // 默认值

const menuItems = [
  { name: '首页', path: '/' },
  { name: '新闻中心', path: '/news' },
  { name: '产品服务', path: '/product' },
];

// 根据登录状态过滤菜单项
const filteredMenuItems = computed(() => {
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

/* 暗色主题样式 */
.nav-bg {
  background-color: rgba(15, 23, 42, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

.nav-text {
  color: #e2e8f0;
}

.nav-text:hover {
  color: #ffffff;
}

.nav-dropdown {
  background-color: rgba(15, 23, 42, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

/* 登录按钮样式 */
.login-btn {
  background-color: transparent;
  color: white;
  font-weight: 500;
  border: 1px solid transparent;
  border-image: linear-gradient(to right, #60a5fa, #a855f7);
  border-image-slice: 1;
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.2);
  transform: translateY(0);
  margin-right: 0.75rem;
  border-radius: 1.5rem;
  height: 2.25rem;
}

.login-btn:hover {
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
  transform: translateY(-2px);
  color: white;
  border-radius: 0;
}

.login-btn:active {
  transform: translateY(1px);
  box-shadow: 0 0 5px rgba(96, 165, 250, 0.3);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.login-btn {
  animation: pulse 3s infinite ease-in-out;
}

/* 手机端底部菜单样式 */
.nav-link-mobile {
  position: relative;
  overflow: hidden;
}

.nav-link-mobile::after {
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

.nav-link-mobile:hover::after,
.active-mobile::after {
  width: 80%;
}

.active-mobile {
  color: white;
  background: linear-gradient(to bottom, rgba(96, 165, 250, 0.1), rgba(168, 85, 247, 0.1));
}
</style>
