import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建Vuex对象
const store = new Vuex.Store({
    state:{
        username:'demo-user',
        cmIp:'http://222.29.39.6:10286'
    }
})


export default store