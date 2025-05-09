<template>
  <div class="flex flex-col items-center justify-center p-8">
    <div class="mb-4">
      <slot name="icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" class="text-blue-500 dark:text-blue-400">
          <path d="M32 8C18.745 8 8 18.745 8 32C8 45.255 18.745 56 32 56C45.255 56 56 45.255 56 32C56 18.745 45.255 8 32 8ZM32 52C20.954 52 12 43.046 12 32C12 20.954 20.954 12 32 12C43.046 12 52 20.954 52 32C52 43.046 43.046 52 32 52Z" 
            class="fill-current"/>
        </svg>
      </slot>
    </div>
    <div class="text-center">
      <slot>
        <p class="text-gray-700 dark:text-gray-300 font-medium">暂无数据</p>
      </slot>
    </div>
  </div>
</template>
<style scoped>
/* 所有样式都通过Tailwind类实现，不需要自定义样式 */
</style>
