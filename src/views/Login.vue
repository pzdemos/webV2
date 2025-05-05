<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md transform transition-all duration-300 hover:shadow-xl">
      <h1 class="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">登录</h1>
      
      <form @submit.prevent="validateAndLogin" class="space-y-6">
        <!-- 用户名输入框 -->
        <div class="space-y-2">
          <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">用户名</label>
          <div class="relative">
            <input 
              id="username" 
              v-model="username" 
              type="text"
              :class="{'border-red-500': usernameError}"
              class="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              placeholder="请输入用户名"
            />
            <span class="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
          <p v-if="usernameError" class="text-red-500 text-xs mt-1">{{ usernameError }}</p>
        </div>
        
        <!-- 密码输入框 -->
        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">密码</label>
          <div class="relative">
            <input 
              id="password" 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              :class="{'border-red-500': passwordError}"
              class="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              placeholder="请输入密码"
            />
            <span class="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <button 
              type="button" 
              @click="showPassword = !showPassword" 
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
        </div>

        <!-- 记住密码 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input 
              id="remember" 
              v-model="rememberMe" 
              type="checkbox" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">记住密码</label>
          </div>
          <div class="text-sm">
            <a href="#" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">忘记密码？</a>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="userStore.error" class="text-red-500 text-sm text-center animate-pulse">{{ userStore.error }}</div>
        
        <!-- 登录按钮 -->
        <button 
          type="submit" 
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 active:scale-95"
          :disabled="userStore.loading"
        >
          登录
        </button>
      </form>
      
      <!-- 注册链接 -->
      <div class="mt-6 text-center">
        <router-link to="/register" class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
          没有账号？立即注册
        </router-link>
      </div>
    </div>
  </div>
  
  <!-- 加载遮罩 -->
  <Loading v-if="userStore.loading" text="登录中" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Loading from '@/components/Loading.vue';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);
const usernameError = ref('');
const passwordError = ref('');

// 表单验证
const validateForm = () => {
  usernameError.value = '';
  passwordError.value = '';
  
  let isValid = true;
  
  if (!username.value) {
    usernameError.value = '用户名不能为空';
    isValid = false;
  } else if (username.value.length < 3) {
    usernameError.value = '用户名长度不能少于3个字符';
    isValid = false;
  }
  
  if (!password.value) {
    passwordError.value = '密码不能为空';
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.value = '密码长度不能少于6个字符';
    isValid = false;
  }
  
  return isValid;
};

const validateAndLogin = async () => {
  if (validateForm()) {
    const result = await userStore.userLogin({
      username: username.value,
      password: password.value,
      rememberMe: rememberMe.value
    });
    
    if (result.success) {
      router.push('/');
    }
  }
};

// 页面加载时检查是否有保存的登录信息
onMounted(() => {
  username.value = userStore.username || '';
  password.value = userStore.getRememberedPassword() || '';
  rememberMe.value = !!userStore.getRememberedPassword();
});
</script>

<style scoped>
/* Tailwind已提供所需样式 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>