import Vue from 'vue'
import VueRouter from 'vue-router'
import routers from './routers'
import store from './store'
import App from './App'

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

//新建VueRouter实例
const router = new VueRouter({
  mode:'history',
  routes:routers
})
//路由跳转前的验证
router.beforeEach((to, from, next) =>{
  if(to.path === '/LoginPage'){
    next();
  }else{
    if(to.meta.requireAuth && !store.state.isLogged){
      next({path:'/LoginPage'})      
    }else{
      next()
    }
  }
})

//将vue实例挂载到app上
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),  
})
