import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 加载全局样式文件
import './styles/index.less'
// 加载element组件库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.config.devtools = true;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
