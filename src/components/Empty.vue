<template>
  <div class="empty-container">
    <div class="empty-icon">
      <slot name="icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 52C20.954 52 12 43.046 12 32C12 20.954 20.954 12 32 12C43.046 12 52 20.954 52 32C52 43.046 43.046 52 32 52Z" 
            class="theme-color"/>
        </svg>
      </slot>
    </div>
    <div class="empty-text">
      <slot>
        <p>暂无数据</p>
      </slot>
    </div>
  </div>
</template>
<style scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-text {
  color: var(--primary-color, #1976D2);
}

.theme-color {
  fill: var(--primary-color, #1976D2);
}
</style>
