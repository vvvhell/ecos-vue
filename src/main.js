import Vue from 'vue'
import VueRouter from 'vue-router'
import routers from './routers'
import store from './store'
import App from './APP'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import vueCanvasPoster from 'vue-canvas-poster'

import axios from 'axios'
import JsEncrypt from 'jsencrypt'

Vue.use(ElementUI)
Vue.use(vueCanvasPoster)
Vue.use(VueRouter)
Vue.prototype.$axios = axios
Vue.prototype.$jsEncrypt = JsEncrypt


const router = new VueRouter({
  mode:'history',
  routes:routers
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),  
})
