import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import axios from 'axios'
import vueCanvasPoster from 'vue-canvas-poster'


Vue.use(ElementUI)
Vue.use(vueCanvasPoster)
Vue.prototype.$axios = axios


new Vue({
  el: '#app',
  render: h => h(App),  
})
