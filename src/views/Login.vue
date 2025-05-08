<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
    <div class="w-full max-w-md overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <!-- 登录表单卡片 -->
      <div class="relative">
        <!-- 顶部装饰条 -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
        
        <!-- 登录表单 -->
        <div class="p-8">
          <div class="flex flex-col items-center mb-8">
            <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-white">欢迎回来</h1>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">请登录您的账号以继续</p>
          </div>
          
          <form @submit.prevent="validateAndLogin" class="space-y-6">
            <!-- 用户名输入框 -->
            <div class="space-y-2">
              <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">用户名</label>
              <div class="relative group">
                <input 
                  id="username" 
                  v-model="username" 
                  type="text"
                  :class="{
                    'border-red-500 ring-1 ring-red-500': usernameError,
                    'focus:border-blue-500 focus:ring-blue-500': !usernameError,
                    'bg-blue-50 dark:bg-blue-900/20': username && !usernameError
                  }"
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="输入您的用户名"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-600 group-focus-within:bg-blue-100 dark:group-focus-within:bg-blue-900 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
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
                  :class="{
                    'border-red-500 ring-1 ring-red-500': passwordError,
                    'focus:border-blue-500 focus:ring-blue-500': !passwordError,
                    'bg-blue-50 dark:bg-blue-900/20': password && !passwordError
                  }"
                  class="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white transition-all duration-200"
                  placeholder="输入您的密码"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div class="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-600 group-focus-within:bg-blue-100 dark:group-focus-within:bg-blue-900 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
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
            </div>

            <!-- 记住密码 & 忘记密码 -->
            <div class="flex items-center justify-between mt-6">
              <div class="flex items-center">
                <div class="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    id="remember" 
                    v-model="rememberMe" 
                    type="checkbox" 
                    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                  />
                  <label 
                    for="remember" 
                    class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
                <label for="remember" class="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">记住密码</label>
              </div>
              <div class="text-sm">
                <a href="#" @click.prevent="showForgotPasswordDialog" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                  忘记密码？
                </a>
              </div>
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
            
            
            
            <!-- 登录按钮 -->
            <button 
              type="button" 
              @click="validateAndLogin"
              class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              :disabled="userStore.loading"
            >
              <span v-if="!userStore.loading">登录</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </span>
            </button>
          </form>
          
          <!-- 注册链接 -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              没有账号？ 
              <router-link to="/register" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200">
                立即注册
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="bg-gray-50 dark:bg-gray-700 px-8 py-4 border-t border-gray-200 dark:border-gray-600 flex items-center justify-center">
        <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          安全登录受到保护
        </div>
      </div>

      <!-- 忘记密码弹窗 -->
      <el-dialog
        v-model="forgotPasswordVisible"
        title="忘记密码"
        width="350px"
        align-center
      >
        <div class="p-3 text-center">
          <el-icon class="text-4xl text-yellow-500 mb-3"><WarningFilled /></el-icon>
          <p class="text-gray-700 dark:text-gray-300 mb-5">
            密码重置需要联系管理员处理
          </p>
          <div class="flex justify-center space-x-3">
            <el-button plain @click="forgotPasswordVisible = false">取消</el-button>
            <el-button type="primary" @click="contactAdmin">联系管理员</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import { WarningFilled } from '@element-plus/icons-vue';

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
  } else if (username.value.length < 2) {
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

// 页面加载时检查是否有保存的登录信息
onMounted(() => {
  // 检查是否记住了密码
  const isRemembered = localStorage.getItem('rememberMe') === 'true';
  
  if (isRemembered) {
    // 如果记住了密码，获取保存的用户名和密码
    username.value = userStore.getRememberedUsername();
    password.value = userStore.getRememberedPassword();
    rememberMe.value = true;
    console.log('已从本地存储加载保存的用户信息');
  } else {
    // 如果已登录但没有记住密码，只获取用户名
    if (userStore.isLoggedIn()) {
      username.value = userStore.username || '';
    }
    password.value = '';
    rememberMe.value = false;
  }
});

// 监听记住密码复选框变化
watch(rememberMe, (newValue) => {
  console.log('记住密码设置已更改:', newValue);
});

// 定义一个方法来处理登录成功后的操作
const handleLoginSuccess = (result) => {
  if (result.success) {
    console.log('登录成功');
    if (rememberMe.value) {
      console.log('用户勾选了记住密码，信息将保存到本地存储');
    } else {
      console.log('用户未勾选记住密码，不保存密码到本地存储');
    }
    router.push('/');
  }
};

// 登录方法
const validateAndLogin = async () => {
  // 表单验证
  if (!validateForm()) {
    return;
  }
  
  // 直接登录
  const result = await userStore.userLogin({
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value
  });
  
  handleLoginSuccess(result);
};

// 忘记密码功能
const forgotPasswordVisible = ref(false);

// 显示忘记密码弹窗
const showForgotPasswordDialog = () => {
  forgotPasswordVisible.value = true;
};

// 联系管理员
const contactAdmin = () => {
  ElMessage({
    type: 'success',
    message: '已发送密码重置请求',
    duration: 3000
  });
  forgotPasswordVisible.value = false;
};
</script>

<style scoped>
.toggle-checkbox:checked {
  transform: translateX(1rem);
  border-color: rgb(87, 105, 212);
}

.toggle-checkbox:checked + .toggle-label {
  background-color: rgb(87, 105, 212);
}

/* 添加明显的动画效果，使切换更加明显 */
.toggle-checkbox {
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.toggle-label {
  transition: background-color 0.3s ease;
}

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