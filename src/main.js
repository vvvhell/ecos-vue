import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import axios from 'axios'
import vueCanvasPoster from 'vue-canvas-poster'
import JsEncrypt from 'jsencrypt'




Vue.use(ElementUI)
Vue.use(vueCanvasPoster)
Vue.prototype.$axios = axios
Vue.prototype.$jsEncrypt = JsEncrypt

new Vue({
  el: '#app',
  render: h => h(App),  
})
