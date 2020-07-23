/*
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-05-19 12:40:40
 * @FilePath: \alien-docsg:\CaryFile\project\project\ninth-system\src\main.js
 */ 
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import moment from 'moment'// 导入文件
import '@/assets/iconfont/iconfont.css'
import 'ant-design-vue/dist/antd.css'
import Store from '@/vuex/store.js'
// import waterfall from 'vue-waterfall2'
import router from './router'
import $ from 'jquery'
import { Select } from 'ant-design-vue'

// 装样式工具
// import '@/styles/cc-css-tools.css'

Vue.prototype.$moment = moment// 赋值使用
Vue.prototype.$store = Store
Vue.prototype.$eventBus = new Vue()
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' })// 引入文件
Vue.use(VueCookies)
Vue.use(VueAxios, axios)
Vue.use(Select)
// Vue.use(waterfall)

moment.locale('zh-cn')

// Vue.prototype.$http = axios// 将axios挂载到Vue实例中的$ajax上面,在项目中的任何位置通过this.$http使用
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
axios.defaults.withCredentials = true
/* eslint-disable no-new */
new Vue({
  el: '#app',
  Store,
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
