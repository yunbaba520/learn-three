import { createApp } from "vue";
import "./assets/main.css";
import router from "./工厂模型案例/router/index";
// import App from "./01-three三要素场景，相机，渲染器.vue";
// import App from "./02-坐标.vue";
// import App from "./03-GUI-点光源-帧率-循环渲染-相机控制.vue";
// import App from "./04-工厂模型-描边高亮.vue";
// import App from "./05-工厂模型-选取模型.vue";
// import App from "./06-工厂模型-点击选中高亮.vue";
// import App from "./07-给模型添加标签.vue";
// import App from "./08-相机tween飞行动画.vue";
// import App from "./09-相机按路线移动.vue";
// import App from "./10-管道相机案例.vue";
// import App from "./11-室内环境.vue";
// import App from "./12-正方体加图片实现全景看房.vue";
// import App from "./13-电子围栏-纹理贴图.vue";
// import App from "./14-仪器模型展示.vue";
// import App from "./15-learn-数学几何计算基础.vue";
// import App from "./16-模型扫光效果.vue";
// import App from "./17-雷达扫描效果.vue";
// import App from "./17-雷达扫描效果-纹理贴图.vue";
// import App from "./18-背景用图片展示.vue";
// import App from "./19-纹理偏移效果.vue";
// import App from "./20-扩散光圈.vue";
// import App from "./21-扩散波效果.vue";
// import App from "./22-旋转棱锥效果.vue";
// import App from "./23-信号波.vue";
// import App from "./24-渐变墙.vue";
import App from "./25-添加文字与logo.vue";
// import App from "./工厂模型案例/app.vue";

const app = createApp(App);
app.use(router);
app.mount("#app");
