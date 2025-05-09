<template>
  <div class="image-loader-container relative overflow-hidden rounded-lg w-full h-full bg-gray-100 dark:bg-gray-800/50" :class="{ 'image-loaded': isLoaded }">
    <!-- 加载动画 -->
    <div v-if="!isLoaded" class="image-loader relative w-full h-full flex justify-center items-center z-10">
      <!-- 顶部装饰条 -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
      <div class="loader-animation">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
        </svg>
        <div class="pulse-ring"></div>
      </div>
      <div class="shimmer-effect"></div>
    </div>
    
    <!-- 图片 -->
    <img 
      :src="src" 
      :alt="alt"
      :class="imageClass"
      @load="onImageLoaded"
      :style="{ opacity: isLoaded ? 1 : 0 }"
      class="transition-opacity duration-700 ease-in-out"
    >
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Image'
  },
  imageClass: {
    type: String,
    default: ''
  }
});

const isLoaded = ref(false);

const onImageLoaded = () => {
  // 添加小延迟，使动画效果更加平滑
  setTimeout(() => {
    isLoaded.value = true;
  }, 300);
};
</script>

<style scoped>
/* 已通过Tailwind类实现 */
.image-loader-container {
  /* 通过Tailwind类实现 */
}

.image-loader {
  background: white;
}

@media (prefers-color-scheme: dark) {
  .image-loader {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }
}

.loader-animation {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
}

.spinner {
  animation: rotate 2s linear infinite;
  z-index: 2;
  width: 40px;
  height: 40px;
}

.spinner .path {
  stroke: #3b82f6; /* blue-500 */
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite, glow 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes glow {
  0%, 100% {
    stroke: #3b82f6; /* blue-500 */
    filter: drop-shadow(0 0 2px #3b82f6);
  }
  50% {
    stroke: #8b5cf6; /* purple-500 */
    filter: drop-shadow(0 0 5px #6366f1);
  }
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(99, 102, 241, 0) 70%);
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

/* 发光效果 */
.shimmer-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(243, 244, 246, 0) 0%,
    rgba(59, 130, 246, 0.1) 50%,
    rgba(243, 244, 246, 0) 100%
  );
  animation: shimmer 2s infinite;
  background-size: 200% 100%;
}

@media (prefers-color-scheme: dark) {
  .shimmer-effect {
    background: linear-gradient(
      to right,
      rgba(15, 23, 42, 0) 0%,
      rgba(59, 130, 246, 0.1) 50%,
      rgba(15, 23, 42, 0) 100%
    );
  }
}

@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

.image-loaded .image-loader {
  opacity: 0;
  transition: opacity 0.5s ease-out;
  pointer-events: none;
}
</style>
