import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import locale from 'element-plus/lib/locale/lang/zh-cn';//中文
const app = createApp(App)


// 路由级钩子
router.beforeEach((to, from, next) => {
    console.log(to);
    const token = localStorage.getItem('token')
    if (to.path == '/login' && token) return next('/')
    if (to.path == '/login') return next()
    if (!token) return next('login')
    next();
});

app.use(router)
app.use(store)
app.use(ElementPlus,{ locale },{zIndex:30000})

app.mount('#app')

