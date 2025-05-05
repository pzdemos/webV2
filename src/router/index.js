import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "@/views/Home.vue";
import News from "@/views/News.vue";
import NewsDetail from "@/views/NewsDetail.vue";
import Products from "@/views/Products.vue";
import ProductDetail from "@/views/ProductDetail.vue";
import Login from "@/views/Login.vue";
import Register from '@/views/Register.vue';
import { useUserStore } from '@/stores/user';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/news',
        name: 'news',
        component: News
    },
    {
        path: '/NewsDetail/:id',
        name: 'new',
        component: NewsDetail
    },
    {
        path: '/product',
        name: 'product',
        component: Products
    },
    {
        path: '/product/:id',
        name: 'productDetail',
        component: ProductDetail
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            hideForAuth: true
        }
    },
    {
        path: '/register',
        name: "register",
        component: Register,
        meta: {
            hideForAuth: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    // 初始化Pinia store
    const userStore = useUserStore();
    
    // 检查页面是否需要登录权限
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    // 检查页面是否在登录状态下应该隐藏（比如登录页、注册页）
    const hideForAuth = to.matched.some(record => record.meta.hideForAuth);
    
    // 如果需要登录权限但未登录，重定向到登录页
    if (requiresAuth && !userStore.isLoggedIn()) {
        next({ name: 'login' });
    }
    // 如果用户已登录且访问的是应该隐藏的页面（如登录页），重定向到首页
    else if (hideForAuth && userStore.isLoggedIn()) {
        next({ name: 'Home' });
    }
    // 其他情况正常导航
    else {
        next();
    }
})

router.afterEach(() => {
    // 页面滚动到顶部
    window.scrollTo(0, 0);
})

export default router
