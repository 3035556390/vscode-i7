import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';

// 提前设置主题，避免闪烁
document.body.setAttribute('arco-theme', 'dark')

const app = createApp(App);
app.use(ArcoVue);

// 可以添加错误处理
try {
    app.mount('#app');
} catch (error) {
    console.error('应用挂载失败:', error);
}