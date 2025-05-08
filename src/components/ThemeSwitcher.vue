<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn btn-ghost m-1 flex items-center">
      <span :key="currentTheme" class="theme-icon">{{ currentThemeIcon }}</span>
    </label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow rounded-box w-52 border border-slate-200 dark:border-slate-700">
      <li>
        <button 
          class="w-full text-left m-1 flex items-center" 
          :class="{ 'bg-primary/10 text-primary': currentTheme === 'light' }"
          @click="changeTheme('light')"
        >
          <span class="mr-2">☀️</span> 亮色模式
        </button>
      </li>
      <li>
        <button 
          class="w-full text-left m-1 flex items-center" 
          :class="{ 'bg-primary/10 text-primary': currentTheme === 'dark' }"
          @click="changeTheme('dark')"
        >
          <span class="mr-2">🌙</span> 暗色模式
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentTheme = ref('light');

const themes = {
  light: '☀️',
  dark: '🌙',
};

const currentThemeIcon = ref(themes[currentTheme.value]);

const changeTheme = (theme) => {
  if (!themes[theme] || currentTheme.value === theme) return;

  const html = document.documentElement;
  currentTheme.value = theme;
  currentThemeIcon.value = themes[theme];
  
  // 添加过渡类
  html.classList.add('theme-transition');
  
  // 设置主题
  html.setAttribute('data-theme', theme);
  localStorage.setItem('preferred-theme', theme);
  
  // 同时处理暗黑模式类
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  
  // 移除过渡类
  setTimeout(() => {
    html.classList.remove('theme-transition');
  }, 500);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('preferred-theme') || 'light';
  if (themes[savedTheme]) {
    currentTheme.value = savedTheme;
    currentThemeIcon.value = themes[savedTheme];
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 同时处理暗黑模式类
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    const newTheme = e.matches ? 'dark' : 'light';
    // 仅在用户未手动设置主题时响应系统变化
    if (!localStorage.getItem('preferred-theme')) {
      changeTheme(newTheme);
    }
  });
});
</script>

<style>
:root {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.theme-transition {
  transition: all 0.3s ease;
}

.dropdown-content {
  z-index: 1000;
  background-color: var(--card-bg) !important;
  color: var(--text-color) !important;
}

.theme-icon {
  display: inline-block;
  animation: spinFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes spinFadeIn {
  from {
    opacity: 0;
    transform: scale(0.8) rotate(-360deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* 主题选择器按钮样式 */
.dropdown-content button {
  color: var(--text-color);
  transition: all 0.2s ease;
}

.dropdown-content button:hover {
  background-color: var(--hover-bg);
}
</style>
