import { createApp } from "vue";
import App from "./App";
import router from "./router";
// import ViewUiPlus from "view-ui-plus";
// import "view-ui-plus/dist/styles/viewuiplus.css";
import "./styles/index.less";
import VueLazyLoad from "vue3-lazyload";
// import { registerSW } from 'virtual:pwa-register';
// 自定义字体文件

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives
});

import "@/assets/fonts/font.css";
// import axios from 'axios';

import i18n from "./language/index";
// if ('serviceWorker' in navigator) {
//   registerSW();
// }
const app = createApp(App);
// app.config.globalProperties.$http = axios;

app
  .use(router)
  .use(i18n)
  .use(VueLazyLoad, {})
  // .use(ViewUiPlus)
  .use(vuetify)

  .mount("#app");
