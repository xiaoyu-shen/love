import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css';
import memoryUtils from "@/utils/memoryUtils"
import storageUtils from '@/utils/storageUtils'
import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.prototype.$tinymce = tinymce
Vue.use(VueTinymce)

const user = storageUtils.getUser()
if (user && user._id) {
  memoryUtils.user = user
}

Vue.config.productionTip = false;
Vue.use(ElementUI)
console.log(process.env.VUE_APP_BASE_API);

import './permission'
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
