<template>
  <div v-show="modelValue" class="captcha-modal-backdrop" @click.self="closeModal">
    <div class="captcha-modal-container" @click.stop>
      <!-- 弹窗头部 -->
      <div class="modal-header">
        <h3 class="modal-title">人机验证</h3>
        <button @click="closeModal" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <!-- 弹窗内容 -->
      <div class="modal-body">
        <div class="verify-notice">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p class="mb-4">请完成人机验证以继续操作</p>
          
          <div class="captcha-container">
            <CaptchaVerify ref="captchaRef" @verified="handleVerified" />
          </div>
        </div>
      </div>
      
      <!-- 已移除底部按钮 -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import CaptchaVerify from './CaptchaVerify.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'verified']);

const captchaRef = ref(null);
const isVerified = ref(false);

// 监听弹窗显示状态，重置验证
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    isVerified.value = false;
    // 如果弹窗打开，延迟一点重置验证组件，确保DOM已渲染
    setTimeout(() => {
      if (captchaRef.value) {
        captchaRef.value.resetVerification();
      }
    }, 100);
  }
});

// 验证通过处理
const handleVerified = () => {
  isVerified.value = true;
  
  // 验证成功后自动触发确认操作
  setTimeout(() => {
    emit('verified', true);
    closeModal();
  }, 500); // 等待一下，让用户看到成功勾选图标
};

// 确认验证
const confirmVerify = () => {
  if (isVerified.value) {
    emit('verified', true);
    closeModal();
  }
};

// 关闭弹窗
const closeModal = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.captcha-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(2px);
}

.captcha-modal-container {
  background-color: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(229, 231, 235, 1);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(17, 24, 39, 1);
}

.close-btn {
  color: rgba(107, 114, 128, 1);
  transition: color 0.2s;
}

.close-btn:hover {
  color: rgba(55, 65, 81, 1);
}

.modal-body {
  padding: 1.5rem;
  flex-grow: 1;
}

.verify-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: rgba(55, 65, 81, 1);
}

.captcha-container {
  width: 100%;
  margin-top: 1rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid rgba(229, 231, 235, 1);
}

.cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: rgba(55, 65, 81, 1);
  background-color: white;
  border: 1px solid rgba(209, 213, 219, 1);
  transition: all 0.2s;
}

.cancel-btn:hover {
  background-color: rgba(249, 250, 251, 1);
}

.confirm-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #3b82f6, #4f46e5);
  transition: all 0.2s;
}

.confirm-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #2563eb, #4338ca);
  transform: translateY(-1px);
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 其他样式 */

@media (prefers-color-scheme: dark) {
  .captcha-modal-container {
    background-color: rgba(31, 41, 55, 1);
  }
  
  .modal-header {
    border-bottom-color: rgba(55, 65, 81, 0.5);
  }
  
  .modal-title {
    color: rgba(243, 244, 246, 1);
  }
  
  .close-btn {
    color: rgba(156, 163, 175, 1);
  }
  
  .close-btn:hover {
    color: rgba(209, 213, 219, 1);
  }
  
  .verify-notice {
    color: rgba(209, 213, 219, 1);
  }
  
  .modal-footer {
    border-top-color: rgba(55, 65, 81, 0.5);
  }
  
  .cancel-btn {
    color: rgba(209, 213, 219, 1);
    background-color: rgba(31, 41, 55, 1);
    border-color: rgba(75, 85, 99, 1);
  }
  
  .cancel-btn:hover {
    background-color: rgba(55, 65, 81, 1);
  }
}
</style>
