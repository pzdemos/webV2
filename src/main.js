import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import router from './router'
import './assets/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { getWebsiteConfigs } from './utils/api'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app
  .use(router)
  .use(ElementPlus)
  .use(pinia)
  .mount('#app')

// 动态获取brand_name设置页面标题
async function updatePageTitle() {
  try {
    // 默认标题
    document.title = 'SMart-ck'
    
    // 获取网站配置
    const res = await getWebsiteConfigs()
    
    if (res.data && res.data.data) {
      const configs = res.data.data
      
      if (configs.brand_name) {
        document.title = configs.brand_name
      }
    }
  } catch (error) {
    console.error('获取网站配置失败:', error)
  }
}

// 应用挂载后更新标题
updatePageTitle()
