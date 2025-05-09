<template>
  <div class="relative h-screen overflow-hidden hero-bg">
    <!-- 背景动画效果 -->
    <div class="absolute inset-0">
      <!-- 渐变背景 -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
      
      <!-- 动态光晕效果 -->
      <div class="absolute top-10 left-10 w-72 h-72 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse"></div>
      
      <!-- 浮动粒子效果 -->
      <div class="particles absolute inset-0">
        <div v-for="n in 20" :key="n" 
             class="particle absolute w-2 h-2 bg-white rounded-full"
             :style="{
               left: `${Math.random() * 100}%`,
               top: `${Math.random() * 100}%`,
               animationDelay: `${Math.random() * 5}s`
             }">
        </div>
      </div>
      
      <!-- 装饰线条 -->
      <div class="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div class="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 h-full flex flex-col items-center justify-center px-4">
      <!-- 顶部装饰 -->
      <div class="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div class="flex items-center space-x-2 animate-float">
          <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
          <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
        </div>
      </div>

      <div class="text-center space-y-12">
        <!-- 主标题 -->
        <div class="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
          <span class="typing-title text-4xl md:text-5xl lg:text-6xl font-bold main-title border-r-2 pr-2 animate-blink">
            {{ typingText }}
          </span>
        </div>
        
        <!-- 副标题 -->
        <div class="opacity-0 animate-fadeIn">
          <p class="text-xl md:text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium tracking-wider">
            {{ subtitle }}
          </p>
          <div class="mt-2 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div class="flex items-center space-x-4">
          <div class="tech-circle"></div>
          <div class="tech-circle delay-100"></div>
          <div class="tech-circle delay-200"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getWebsiteConfigs } from "@/utils/api";

const typingText = ref("");
const fullTitle = ref("");
const subtitle = ref("科技改变生活");

onMounted(async () => {
  try {
    // 获取网站配置
    const res = await getWebsiteConfigs();
    
    if (res.data && res.data.data) {
      const configs = res.data.data;
      
      if (configs.home_title) {
        fullTitle.value = configs.home_title;
      } else {
        console.warn('Home组件：未找到home_title配置，使用默认值');
        fullTitle.value = '互联网+时代，让生活更美好！';
      }
      
      if (configs.home_subtitle) {
        subtitle.value = configs.home_subtitle;
      } else {
        console.warn('Home组件：未找到home_subtitle配置，使用默认值');
      }
    } else {
      console.warn('Home组件：响应数据格式不正确', res.data);
      fullTitle.value = '互联网+时代，让生活更美好！';
    }
  } catch (error) {
    console.error('获取网站配置失败:', error);
    fullTitle.value = '互联网+时代，让生活更美好！';
  }
  
  // 开始打字效果
  startTypingAnimation();
});

const startTypingAnimation = () => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < fullTitle.value.length) {
      typingText.value += fullTitle.value.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 200);
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

@keyframes blink {
  0%, 100% { border-color: transparent; }
  50% { border-color: #ffffff; }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}

.animate-fadeIn {
  animation: fadeIn 1.5s ease-out 2.5s forwards;
}

.typing-title {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  letter-spacing: 0.05em;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-10px) translateX(-50%);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* 新增样式 */
.particle {
  opacity: 0.3;
  animation: float-particle 8s infinite;
}

@keyframes float-particle {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(50px, 50px);
  }
  50% {
    transform: translate(0, 100px);
  }
  75% {
    transform: translate(-50px, 50px);
  }
}

.tech-circle {
  width: 8px;
  height: 8px;
  background: linear-gradient(to right, #60a5fa, #a855f7);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.delay-100 {
  animation-delay: 0.3s;
}

.delay-200 {
  animation-delay: 0.6s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}
.hero-bg {
  background-color: #0f172a;
  background-image: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}
.main-title {
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

@keyframes blinkLight {
  0%, 100% { border-color: transparent; }
  50% { border-color: #3b82f6; }
}
</style>
