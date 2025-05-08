<template>
  <div class="captcha-verify-container">
    <button 
      ref="captchaButton" 
      @click="startVerification" 
      :class="[
        'captcha-btn',
        { 'verifying': isVerifying, 'verified': isVerified }
      ]"
      :disabled="isVerifying || isVerified"
    >
      <div class="captcha-btn-content">
        <template v-if="!isVerifying && !isVerified">
          <div class="flex items-center justify-center">
            <span class="shield-icon">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </span>
            <span class="captcha-text ml-2">点击进行人机验证</span>
          </div>
        </template>
        
        <div v-else-if="isVerifying" class="verifying-animation">
          <div class="verify-spinner">
            <div class="spinner-circle"></div>
            <div class="spinner-circle-inner"></div>
          </div>
        </div>
        
        <div v-else class="verified-animation">
          <svg xmlns="http://www.w3.org/2000/svg" class="check-icon h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <!-- 波纹效果容器 -->
      <div v-if="showRipple" class="ripple-container">
        <span 
          v-for="(ripple, index) in ripples" 
          :key="index" 
          class="ripple" 
          :style="{ 
            left: ripple.x + 'px', 
            top: ripple.y + 'px',
            animationDelay: ripple.delay + 'ms'
          }"
        ></span>
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  duration: {
    type: Number,
    default: 2000 // 默认验证时间
  }
});

const emit = defineEmits(['verified']);

const captchaButton = ref(null);
const isVerifying = ref(false);
const isVerified = ref(false);
const showRipple = ref(false);
const ripples = ref([]);

// 点击验证按钮开始验证
const startVerification = (event) => {
  if (isVerifying.value || isVerified.value) return;
  
  // 创建点击波纹效果
  createRippleEffect(event);
  
  // 开始验证过程
  isVerifying.value = true;
  showRipple.value = true;
  
  // 模拟验证过程
  setTimeout(() => {
    isVerifying.value = false;
    isVerified.value = true;
    showRipple.value = false;
    
    // 通知父组件验证已完成
    emit('verified', true);
  }, props.duration);
};

// 创建波纹效果
const createRippleEffect = (event) => {
  if (!captchaButton.value) return;
  
  const button = captchaButton.value;
  const rect = button.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  ripples.value = [];
  
  // 创建多个波纹带有不同延迟
  for (let i = 0; i < 3; i++) {
    ripples.value.push({
      x,
      y,
      delay: i * 100
    });
  }
};

// 重置验证状态
const resetVerification = () => {
  isVerifying.value = false;
  isVerified.value = false;
  showRipple.value = false;
  ripples.value = [];
};

// 对外暴露方法
defineExpose({
  resetVerification
});
</script>

<style scoped>
.captcha-verify-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

.captcha-btn {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #4f46e5);
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  outline: none;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.captcha-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #2563eb, #4338ca);
}

.captcha-btn:active:not(:disabled) {
  transform: translateY(0);
}

.captcha-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
}

.shield-icon {
  display: inline-flex;
  animation: pulse 2s infinite;
}

/* 验证中样式 */
.verifying {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  cursor: not-allowed;
}

/* 验证成功样式 */
.verified {
  background: linear-gradient(135deg, #10b981, #059669);
  cursor: default;
}

.check-icon {
  animation: check-animation 0.5s ease-out forwards;
}

/* 验证中的动画 */
.verify-spinner {
  position: relative;
  width: 24px;
  height: 24px;
}

.spinner-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-circle-inner {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-bottom: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite reverse;
}

/* 波纹效果 */
.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 0.8s ease-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes check-animation {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.verified-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: verified-animation 0.5s ease-out forwards;
}

@keyframes verified-animation {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
