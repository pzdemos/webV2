<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="btn m-1 flex items-center">
      <span :key="currentTheme" class="theme-icon">{{ currentThemeIcon }}</span>
    </label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
      <li>
        <button 
          class="w-full text-left m-1" 
          :class="{ 'bg-primary text-primary-content': currentTheme === 'light' }"
          @click="changeTheme('light')"
        >Light</button>
      </li>
      <li>
        <button 
          class="w-full text-left m-1" 
          :class="{ 'bg-primary text-primary-content': currentTheme === 'dark' }"
          @click="changeTheme('dark')"
        >Dark</button>
      </li>
      <li>
        <button 
          class="w-full text-left m-1" 
          :class="{ 'bg-primary text-primary-content': currentTheme === 'cupcake' }"
          @click="changeTheme('cupcake')"
        >Cupcake</button>
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
  cupcake: '🧁',
};

const currentThemeIcon = ref(themes[currentTheme.value]);

const changeTheme = (theme) => {
  if (!themes[theme] || currentTheme.value === theme) return;

  const html = document.documentElement;
  currentTheme.value = theme;
  currentThemeIcon.value = themes[theme];
  
  html.classList.add('theme-transition');
  html.setAttribute('data-theme', theme);
  localStorage.setItem('preferred-theme', theme);
  
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
  }
});
</script>

<style>
:root {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.theme-transition {
  transition: all 0.3s ease;
}

.dropdown-content {
  z-index: 1000;
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
</style>
