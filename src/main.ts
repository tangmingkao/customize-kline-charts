import { createApp } from 'vue';
import App from './App.vue';

// 引入样式
import "@/assets/scss/main.scss";
import "@/assets/css/front.css";
import "@/assets/css/tailwind.css";
// 引入iconfont
import "@/assets/iconfont/iconfont.css";

// element-plus
import ElementPlus from "element-plus";
import "element-plus/theme-chalk/src/index.scss";


const app = createApp(App);

app.use(ElementPlus, { size: "default", zIndex: 3000 });

app.mount('#app');