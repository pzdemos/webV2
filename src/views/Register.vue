<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
    <div class="w-full max-w-md overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <!-- 注册表单卡片 -->
      <div class="relative">
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <!-- 注册表单 -->
        <div class="p-8">
          <div class="flex flex-col items-center mb-8">
            <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-white">创建账号</h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">加入我们，开始您的旅程</p>
          </div>
          
          <form @submit.prevent="validateAndRegister" class="space-y-6">
            <!-- 用户名输入框 -->
            <div class="space-y-2">
              <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">用户名</label>
              <div class="relative group">
                <input 
                  id="username" 
                  v-model="username" 
                  type="text"
                  :class="{'border-red-500 ring-1 ring-red-500': usernameError,
                          'focus:border-indigo-500 focus:ring-indigo-500': !usernameError}"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="输入您的用户名"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-600 group-focus-within:bg-indigo-100 dark:group-focus-within:bg-indigo-900 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <p v-if="usernameError" class="flex items-center text-red-500 text-xs mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ usernameError }}
              </p>
            </div>
            
            <!-- 密码输入框 -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">密码</label>
              <div class="relative group">
                <input 
                  id="password" 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'"
                  :class="{'border-red-500 ring-1 ring-red-500': passwordError,
                          'focus:border-indigo-500 focus:ring-indigo-500': !passwordError}"
                  class="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="创建一个安全的密码"
                  @input="checkPasswordStrength"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-600 group-focus-within:bg-indigo-100 dark:group-focus-within:bg-indigo-900 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none"
                >
                  <div class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                    <template v-if="showPassword">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                      </svg>
                    </template>
                    <template v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    </template>
                  </div>
                </button>
              </div>
              <p v-if="passwordError" class="flex items-center text-red-500 text-xs mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ passwordError }}
              </p>
              
              <!-- 密码强度指示器 -->
              <div v-if="password" class="mt-3">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-600 dark:text-gray-400">密码强度:</span>
                  <span class="text-xs font-medium" :class="strengthTextClass">{{ strengthText }}</span>
                </div>
                <div class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-300" :style="{ width: `${passwordStrength}%` }" :class="strengthClass"></div>
                </div>
                <div class="mt-1 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap gap-1">
                  <span class="inline-flex items-center gap-0.5">
                    <svg :class="password.length >= 8 ? 'text-green-500' : 'text-gray-400'" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="password.length >= 8" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <circle v-else cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none" />
                    </svg>
                    8个字符
                  </span>
                  <span class="inline-flex items-center gap-0.5">
                    <svg :class="/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="/[A-Z]/.test(password)" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <circle v-else cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none" />
                    </svg>
                    大写字母
                  </span>
                  <span class="inline-flex items-center gap-0.5">
                    <svg :class="/\d/.test(password) ? 'text-green-500' : 'text-gray-400'" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="/\d/.test(password)" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <circle v-else cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none" />
                    </svg>
                    数字
                  </span>
                  <span class="inline-flex items-center gap-0.5">
                    <svg :class="/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="/[^A-Za-z0-9]/.test(password)" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      <circle v-else cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.5" fill="none" />
                    </svg>
                    特殊字符
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 确认密码输入框 -->
            <div class="space-y-2">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">确认密码</label>
              <div class="relative group">
                <input 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :class="{'border-red-500 ring-1 ring-red-500': confirmPasswordError,
                          'focus:border-indigo-500 focus:ring-indigo-500': !confirmPasswordError}"
                  class="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="重复输入您的密码"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-600 group-focus-within:bg-indigo-100 dark:group-focus-within:bg-indigo-900 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none"
                >
                  <div class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                    <template v-if="showConfirmPassword">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                      </svg>
                    </template>
                    <template v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    </template>
                  </div>
                </button>
              </div>
              <p v-if="confirmPasswordError" class="flex items-center text-red-500 text-xs mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {{ confirmPasswordError }}
              </p>
            </div>
            
            <!-- 错误信息 -->
            <!-- <div v-if="userStore.error" 
                 class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center mt-4">
               <div class="flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 {{ userStore.error }}
               </div>
             </div> -->
            
            <!-- 注册按钮 -->
            <button 
              type="submit" 
              class="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              :disabled="userStore.loading"
            >
              <span v-if="!userStore.loading">创建账号</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                注册中...
              </span>
            </button>
          </form>
          
          <!-- 登录链接 -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              已有账号？ 
              <router-link to="/login" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors duration-200">
                返回登录
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="bg-gray-50 dark:bg-gray-700 px-8 py-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-center">
        <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          安全创建账号
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const usernameError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const passwordStrength = ref(0);

// 密码强度相关计算属性
const strengthText = computed(() => {
  if (passwordStrength.value < 30) return '弱';
  if (passwordStrength.value < 60) return '中';
  return '强';
});

const strengthClass = computed(() => {
  if (passwordStrength.value < 30) return 'bg-red-500';
  if (passwordStrength.value < 60) return 'bg-yellow-500';
  return 'bg-green-500';
});

const strengthTextClass = computed(() => {
  if (passwordStrength.value < 30) return 'text-red-500';
  if (passwordStrength.value < 60) return 'text-yellow-500';
  return 'text-green-500';
});

// 检查密码强度
const checkPasswordStrength = () => {
  const pwd = password.value;
  if (!pwd) {
    passwordStrength.value = 0;
    return;
  }
  
  let strength = 0;
  
  // 长度检查
  if (pwd.length >= 6) strength += 20;
  if (pwd.length >= 8) strength += 10;
  
  // 包含数字
  if (/\d/.test(pwd)) strength += 10;
  
  // 包含小写字母
  if (/[a-z]/.test(pwd)) strength += 10;
  
  // 包含大写字母
  if (/[A-Z]/.test(pwd)) strength += 20;
  
  // 包含特殊字符
  if (/[^A-Za-z0-9]/.test(pwd)) strength += 30;
  
  passwordStrength.value = Math.min(strength, 100);
};

// 表单验证
const validateForm = () => {
  usernameError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
  
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
  } else if (passwordStrength.value < 30) {
    passwordError.value = '密码强度太弱，建议包含数字、字母和特殊字符';
    isValid = false;
  }
  
  if (!confirmPassword.value) {
    confirmPasswordError.value = '请确认密码';
    isValid = false;
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = '两次输入的密码不一致';
    isValid = false;
  }
  
  return isValid;
};

const validateAndRegister = async () => {
  if (validateForm()) {
    const result = await userStore.userRegister({
      username: username.value,
      password: password.value
    });
    
    if (result.success) {
      router.push('/login');
    }
  }
};
</script>

<style scoped>
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>









